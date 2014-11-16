'use strict';
module.exports = {
  factoryFn: link,
  moduleName: 'am.link',
  entityName: 'link'
};

function link(scope) {
	return new LinkBus(scope);
}

function LinkBus(scope) {
	// the current linked scope
	this.scope = scope;
  // all source states
  this.src = [];
	// all target states
	this.tgt = [];
	// current transformer
	this.transformer = function (nothing, x) {
		return x;
	};

  this.scope.$on('$destroy', function(){
    // kill all references bounded to this scope object
    // in angular all listeners will be removed automatically
    this.src = null;
    this.tgt = null;
    this.scope = null;
    this.transformer = null;
  }.bind(this));
}

// add a state as a change source
LinkBus.prototype.from = function (state, field) {

  // get hold of all registered states
  this.state.push({
    state: state,
    field: field
  });

	if (typeof state[field] === 'function') {
		return this.fromFn(state, field);
	}

	var watched = function () {
		return state[field];
	};

	if (!field) {
		watched = function () {
			return state;
		};
	}

	var watchHandler = function (n, o) {
		if (n !== o) {
			this._dispatch(state);
		}
	}.bind(this);

	//deep watch object if no field defined
  // todo Add deep watch as a parameter to the link?
	this.scope.$watch(watched, watchHandler, !field);

	return this;
};


// add a state as a change target
LinkBus.prototype.to = function (state) {
	if (!state ) {
    throw new Error('You specified an "undefined" state to link!');
  }
	this.tgt.push(state);
	return this;
};


// add a transformer functuion to current link
// should be of type (src, tgt) -> tgt
LinkBus.prototype.with = function (fn) {
	this.transformer = fn;
	return this;
};

// link function call as a change source
LinkBus.prototype.fromFn = function (state, fnName) {
	// remember old function
	var oldFn = state[fnName];

	// hijack with decorator
	state[fnName] = function () {
		var args = [].slice.apply(arguments);

		var result = oldFn.apply(state, args);

		// dispatch change when this method is called
		this._dispatch(result);
	}.bind(this);

	return this;
};

// dispatch change to all targets
LinkBus.prototype._dispatch = function (newVal) {
  if (!this.tgt.length) {
    console.log('The change event inside one of the links has no targets!\nSources: ' + this.src);
  }
	this.tgt.forEach(_applyTransformation(newVal, this.transformer));
};

// propagate transformation to the given target
function _applyTransformation(newVal, transformer) {
	return function (target) {
    var newTarget = transformer(newVal, target);

    if (newTarget === undefined){
      console.log('Warning! The link have resetted the target state to "undefined"!' +
        '\nFeels like a bug.' +
        '\nYou should use a pure function inside link.with().' +
        '\nThis function should return transformed state object:' +
        '\n' + this.transformer);
    }

    // update all fields of the old target
    // Pretending that it acts as an immutable
    Object.keys(target).forEach(function(key){
      target[key] = newTarget[key];
    });
	};
}
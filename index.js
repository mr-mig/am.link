/*global angular*/
'use strict';
module.exports = link;

function link(scope) {
	return new LinkBus(scope);
}

function LinkBus(scope) {
	// the current linked scope
	this.scope = scope;
	// all target states
	this.tgt = [];
	// the current transformer
	this.transformer = function (x) {
		return x;
	};
}

// add a state as a change source
LinkBus.prototype.from = function (state, field) {
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
			this._dispatch(n);
		}
	}.bind(this);

	//deep watch object if no field defined
	this.scope.$watch(watched, watchHandler, !field);

	return this;
};


// add a state as a change target
LinkBus.prototype.to = function (state, field) {
	if (!(state && field)) throw new Error('Cannot link to unspecified field!');
	this.tgt.push({
		state: state,
		field: field
	});
	return this;
};


// add a transformer functuion to current link
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
	this.tgt.forEach(_applyTransformation(newVal, this.transformer));
};

// propagate transformation to the given target
function _applyTransformation(newVal, transformer) {
	return function (target) {
		target.state[target.field] = transformer(newVal);
	};
}
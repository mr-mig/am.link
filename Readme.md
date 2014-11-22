The helper function which links the state objects and propagate change between them using the transformer function.

## What is 'link'?

Link is a helper to make one `state` react to changes in another `state`.  
It is used mainly to make relations between two [elements](https://github.com/mr-mig/am.element) inside a single [composite](https://github.com/mr-mig/am.composite).

```javascript
link($scope)
  .from(state1, 'field1')
  .from(state2, 'field2')
  .to(targetState, 'field3')
  .with(function(newValue){
    return newValue + 'some demo stuff';
  });
```

The rule says:  
_Change the `targetState.field3` using string concatenating function when `state1.field1` or `state2.field2` is changed._

## Conventions
* Link MUST be used to relate two known states in the same composite.
* All method calls CAN be chained.
* There CAN be several source and target states.
* The handler will be automatically destroyed when composite is destroyed (controlled by framework).

## API 

### link(scope)

Create a link using the current scope

### link.from(sourceState, sourceField)

Create a link from the given `sourceState.sourceField` value.
This value will be observed and a change will be triggered if the value changes.

### link.from(sourceState)

Create a link from the given `sourceState` object.
The object will be **deep watched**.
The change will be triggered if any field of the object changes.


### link.from(sourceState, method)

Create a link from the given `sourceState.method` method.
The change will be triggered when **the method is called**.


### link.to(targetState, targetField)

Links the `targetState.targetField` as a target state.
When the change is triggered from the source state, the target state will be modified using transformer function.

### link.with(fn)

Assign the **transform function** to the current link.
Transform function has a signature `sourceState.sourceField -> targetState.targetField`.

When the change is triggered the function will overwrite `targetState.targetField` with a new value.

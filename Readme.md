The helper function which links the state objects and propagate change between them using the transformer function.

## link(scope)

Create a link using the current scope

## link.from(sourceState, sourceField)

Create a link from the given `sourceState.sourceField` value.
This value will be observed and a change will be triggered if the value changes.

## link.from(sourceState)

Create a link from the given `sourceState` object.
The object will be **deep watched**.
The change will be triggered if any field of the object changes.


## link.from(sourceState, method)

Create a link from the given `sourceState.method` method.
The change will be triggered when **the method is called**.


## link.to(targetState, targetField)

Links the `targetState.targetField` as a target state.
When the change is triggered from the source state, the target state will be modified using transformer function.

## link.with(fn)

Assign the **transform function** to the current link.
Transform function has a signature `sourceState.sourceField -> targetState.targetField`.

When the change is triggered the function will overwrite `targetState.targetField` with a new value.
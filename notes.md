# Managing State

## Rules of Store

- Only an event(**_action_**) can change the state of the store
- The function that returns the new state needs to be a **_pure function_**

## Actions

- Control redux state change

- By limiting redux state change to be performed by just **_actions_**, we maintain the predictability of the store

- It allows us know what exact action changed the store, since every action must have a **_type_** property

An action looks like this:

```js
{
  type: "ADD_TODO";
}
```

### Action Rules

- There is no limit to the number of properties an action can have

- However, it is best to keep the data being passed into actions as minimal as possible. i.e pass in an object ID rather than the entire object

### Action Creators

Functions that create/return an action object

## Reducers: Pure functions

- Returns the same results if the same arguments are passed in
- Depends solely on the arguments passed into them: no getting anything from outside
- Does not produce any side effects, such as API requests and I/O operations: no changing anything outside

Sample Reducer

```js
/**
 * TODO reducer
 * @param {Object[]} [state=[]] - Store state
 * @param {string} state[].id - todo ID
 *
 * @param {Object} action - Action chnaging the state
 * @param {string}  action.type - Type of the action
 *
 * @returns {Object[]} - Updated state
 */
const todos = (state = [], action) => {
  if (action.type === "ADD_TODO") return [...state, action.todo];

  return state;
};
```

## Dispatch

Modifies the state with the help of the reducer

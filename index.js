/**
 * Definition for store
 * @typedef {Object} store
 * @property {*} dispatch - Updates store state
 * @property {*} getState - Gets store state
 * @property {*} subscribe - Listens for changes
 */

/**
 * Definition for action
 * @typedef {Object} action
 * @property {string} type - action type
 */

/**
 * Definition for the rootReducer state
 * @typedef {Object} appState
 * @property {todo[]} todos - todos state
 * @property {goal[]} goals - goals state
 */

/**
 * Alternative todos state definition for a function
 * @param {Object[]} state - Store state
 * @param {string} state[].id - todo ID
 */

/**
 * Alternative action definition for a function
 * @param {Object} action - Action chnaging the state
 * @param {string}  action.type - Type of the action
 */

/**
 * Definition for TODO
 * @typedef {Object} todo
 * @property {number} id - todo ID
 * @property {boolean} complete - todo complete status
 * @property {string} name - todo name
 */

/**
 * Definition for Goal
 * @typedef {Object} goal
 * @property {number} id - goal ID
 * @property {string} name - goal name
 */

/**
 * The store should have 4 parts
 * 1. The state
 * 2. Get the state
 * 3. Listen for state changes
 * 4. Update the state
 * @param {*} reducer - Root Reducer function
 * @returns {store}
 */
const createStore = (reducer) => {
  // The State
  let state;
  /**
   * Gets current state value: RETURNS THE STATE
   * @returns {todo[] | goal[]} state - Store state
   */
  const getState = () => state;

  // listeners: Array of all the functions to call whenever state changes
  let listeners = [];

  /**
   *
   * @callback unsubscribe
   */
  /**
   * Updates listeners: LISTENS FOR CHANGES
   * @param {*} listener
   * @returns {unsubscribe} unsubscribe
   */
  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  /**
   * Update the store
   * @param {action} action - Action chnaging the state
   */
  const dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach((l) => l());
  };

  return { dispatch, getState, subscribe };
};

/**
 *! APP CODE
 */

/**
 ** ACTION TYPES
 */
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

/**
 ** ACTION CREATORS
 */
const addGoalAction = (goal) => ({ type: ADD_GOAL, goal });
const removeGoalAction = (id) => ({ type: REMOVE_GOAL, id });
const addTodoAction = (todo) => ({ type: ADD_TODO, todo });
const removeTodoAction = (id) => ({ type: REMOVE_TODO, id });
const toggleTodoAction = (id) => ({ type: TOGGLE_TODO, id });

/**
 ** TODO reducer
 * @param {todo[]} [state=[]] - Todo state
 * @param {action} action - Action changing the state
 * @returns {todo[]} - Updated state
 */
const todos = (state = [], action) =>
  ({
    ADD_TODO: [...state, action.todo],
    REMOVE_TODO: state.filter(({ id }) => id !== action.id),
    TOGGLE_TODO: state.map((todo) =>
      todo.id === action.id ? { ...todo, complete: !todo.complete } : todo
    ),
  }[action.type] || state);

/**
 ** Goal Reducer
 * @param {goal[]} [state=[]] - Goal state
 * @param {action} action  - Action changing the state
 * @returns {goal[]} - Updated state
 */
const goals = (state = [], action) =>
  ({
    ADD_GOAL: [...state, action.goal],
    REMOVE_GOAL: state.filter(({ id }) => id !== action.id),
  }[action.type] || state);

/**
 ** Root Reducer
 * @param {appState} state - App state
 * @param {action} action - Action changing the state
 * @returns {appState} - Updated app state
 */
const app = (state = {}, action) => ({
  todos: todos(state.todos, action),
  goals: goals(state.goals, action),
});

/**
 ** STORE CODE
 */
const store = createStore(app);

store.subscribe(() => console.log("The new state is ", store.getState()));

store.dispatch(
  addTodoAction({
    id: 0,
    name: "Walk the dog",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 1,
    name: "Wash the car",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 2,
    name: "Go to the gym",
    complete: true,
  })
);

store.dispatch(removeTodoAction(1));
store.dispatch(toggleTodoAction(0));

store.dispatch(addGoalAction({id: 0, name:  "Learn Redux"}));
store.dispatch(addGoalAction({id: 1, name:  "Lose 20 pounds"}));
store.dispatch(removeGoalAction(0));

/**
 * Definition for store
 * @typedef {Object} store
 * @property {function} dispatch - Updates store state
 * @property {function} getState - Gets store state
 * @property {function} subscribe - Listens for changes
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
 * @property {string} id - todo ID
 * @property {boolean} complete - todo complete status
 * @property {string} name - todo name
 */

/**
 * Definition for Goal
 * @typedef {Object} goal
 * @property {string} id - goal ID
 * @property {string} name - goal name
 */

/**
 *! LIBRARY CODE
 */
/**
 * The store should have 4 parts
 * 1. The state
 * 2. Get the state
 * 3. Listen for state changes
 * 4. Update the state
 * @param {function} reducer - Root Reducer function
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
   * @param {function} listener
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

store.subscribe(() => {
  const { goals, todos } = store.getState();

  document.getElementById("goals").innerHTML = "";
  document.getElementById("todos").innerHTML = "";

  goals.forEach((goal) => addGoalOrTodoToDOM(goal, "goals"));
  todos.forEach((todo) => addGoalOrTodoToDOM(todo, "todos"));
});

/**
 *! DOM CODE
 */

/**
 * Definition for id
 * @typedef {string} id - A goal or todo id
 */

/**
 * Generates Random ID
 * @returns {id}
 */
const generateId = () =>
  Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

/**
 * UI function to add todo or goal
 * @param {string} inputID - The id of the input element
 */
const addGoalOrTodo = (inputID) => {
  const input = document.getElementById(inputID);
  const name = input.value;
  input.value = "";

  const action =
    inputID === "todo"
      ? addTodoAction({
          id: generateId(),
          complete: false,
          name,
        })
      : addGoalAction({
          id: generateId(),
          name,
        });

  store.dispatch(action);
};

/**
 * Creates the delete button
 * @param {function} onClick - Function to call onClicking the delete button
 * @returns{Object}
 */
const createRemoveButton = (onClick) => {
  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "x";
  removeBtn.addEventListener("click", onClick);

  return removeBtn;
};

/**
 * Add goal or todo to dom
 * @param {Object} object - Either goal or todo
 * @param {string} object.id - The id of the goal or todo
 * @param {string} object.name - The name of the goal or todo
 * @param {boolean} [object.completed] - Inform if todo is completed
 * @param {string} type - Specifies which state we are adding to the DOM
 */
const addGoalOrTodoToDOM = (object, type) => {
  const node = document.createElement("li");
  const text = document.createTextNode(object.name);
  const className = type === "todos" && object.complete ? `${type} done` : type;

  const actionCreator =
    type === "todos"
      ? removeTodoAction(object.id)
      : removeGoalAction(object.id);
  const removeBtn = createRemoveButton(() => store.dispatch(actionCreator));

  node.appendChild(text);
  node.appendChild(removeBtn);
  node.setAttribute("class", className);
  node.addEventListener(
    "click",
    () => type === "todos" && store.dispatch(toggleTodoAction(object.id))
  );

  document.getElementById(type).appendChild(node);
};

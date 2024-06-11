//confidureStore.js
import { combineReducers, createStore } from "redux";
import { counterReducer, counterReducer1 } from "./counter";

const reducer = combineReducers({
  counter: counterReducer,
  counter1: counterReducer1
})

const store = createStore(reducer)
export default store;
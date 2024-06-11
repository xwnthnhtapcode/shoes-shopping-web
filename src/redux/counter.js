//counter.js
const INCREMENT = "increment"
const DECREMENT = "decrement"
const initialState = {
  name: 'duchau',
  count: 0
}

export const increment = () => ({
  type: INCREMENT
})

export const decrement = () => ({
  type: DECREMENT
})

export function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return ({
        ...state,
        count: state.count + 1
      })
    case DECREMENT:
      return ({
        ...state,
        count: state.count - 1
      })
    default:
      return state;
  }
}
// 
export function counterReducer1(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return ({
        ...state,
        count: state.count + 2
      })
    case DECREMENT:
      return ({
        ...state,
        count: state.count - 2
      })
    default:
      return state;
  }
} 
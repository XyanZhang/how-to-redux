import { createContext, useContext, useState, useEffect } from 'react'

export const store = {
  state: {
    user: {name: 'kenanyah', age: 26}
  },
  setState(newState) {
    store.state = newState
    // 视图更新
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

// 根据不同的action类型来处理状态的更新逻辑
// 每个Reducer都只处理自己所负责的一部分状态
const reducer = (state, {type, payload}) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

export const connect = (Component) => {
  return (props) => {
    const context = useContext(appContext)

    if (!context) {
      throw new Error("Missing Provider")
    }
    const { state, setState} = context;

    // connect 的时候订阅，使得在 store state改变的时候，进行视图更新
    const [, update] = useState({})
    useEffect(() => {
      // 订阅
      store.subscribe(() => {
        // 触发更新
        update({})
      })
    }, [])

    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} dispatch={dispatch} state={state}/>
  }
}

export const appContext = createContext(null)
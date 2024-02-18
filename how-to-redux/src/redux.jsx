import { createContext, useContext, useState, useEffect } from 'react'

export const store = {
  state: undefined,
  reducer: undefined,
  setState(newState) {
    store.state = newState
    // 视图更新
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      // 取消监听
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}

export function createStore(reducer, initState) {
  store.state = initState
  store.reducer = reducer
  return store
}
// 判断状态是否改变
const changed = (oldState, newState) => {
  let changed = false
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}

export const connect = (selector, dispatchSelector) => (Component) => {
  let wrapper =  (props) => {
    const dispatch = (action) => {
      setState(store.reducer(state, action))
    }

    const context = useContext(appContext)
    
    const { state, setState} = context;
    
    const data = selector ? selector(state) : { state }
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch};

    // connect 的时候订阅，使得在 store state改变的时候，进行视图更新
    const [, update] = useState({})
    useEffect(() => {
      // 订阅
      let cancelSub = store.subscribe(() => {
        const newData = selector ? selector(store.state) : {state: store.state}
        if (changed(data, newData)) {
          // 触发更新
          update({})
        }
      })

      return cancelSub;
    }, [selector]); // 只执行相关副作用

    return <Component {...props} {...data} {...dispatchers}/>
  }
  return wrapper
}

const appContext = createContext(null)

export const Provider = ({store, children}) => {
  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>
  )
}
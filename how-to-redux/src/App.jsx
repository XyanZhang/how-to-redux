import React from 'react'
import {appContext, store, connect } from './redux.jsx'
import './App.css'

const App = () => {
  return (
    <appContext.Provider value={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => {
  console.log('大儿子执行了 ' + Math.random())
  return (
    <section>大儿子<User/></section>
  )
}
const 二儿子 = () => {
  console.log('二儿子执行了 ' + Math.random())
  return (
    <section>二儿子<UserModifier/></section>
  )
}
const 幺儿子 = () => {
  console.log('幺儿子执行了 ' + Math.random())
  return (
    <section>幺儿子</section>
  )
}
const User = connect(({state}) => {
  console.log('User执行了 ' + Math.random())
  return <div>User:{state.user.name}</div>
})
const UserModifier = connect(({state, dispatch, children}) => {
  console.log('UserModifier执行了 ' + Math.random())
  const onChange = (e) => {
    let name = e.target.value;
    // 更新
    dispatch({
      type: 'updateUser',
      payload: {
        name
      }
    })
  }
  return <div>
    {children}
    <input value={state.user.name}
      onChange={onChange}/>
  </div>
})

export default App
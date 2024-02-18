import {connect} from '../redux.jsx'

const userSelector = state => {
  return {user: state.user}
}
const userDispatcher =(dispatch)=>{
  return {
    updateUser: (attrs)=> dispatch({type: 'updateUser', payload: attrs})
  }
}
export const connectToUser = connect(userSelector, userDispatcher)
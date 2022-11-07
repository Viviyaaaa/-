
import React, {Component,lazy,Suspense} from 'react'
import {Button} from 'antd'
import { Redirect } from 'react-router-dom'
import { Route,Switch } from 'react-router-dom'
import Login from './containers/login/login'
// import Admin from './containers/admin/admin'
const Admin = lazy(() => import("./containers/admin/admin"))
export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
      <Route path='/login' component={Login}></Route>
      <Route path="/admin" component={Admin}></Route>
      <Redirect to="/admin"></Redirect>
     </Switch>
        </Suspense>
     
      </div>
    )
  }
}



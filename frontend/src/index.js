import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import NotFound from './NotFound/NotFound.js'
import Login from './Login/Login.js'
import Dashboard from './Dashboard/Dashboard.js'
import AboutMe from './AboutMe/AboutMe.js'
import AddUser from './AddUser/AddUser.js'
import AddOrder from './AddOrder/AddOrder.js'
import OrdersList from './OrdersList/OrdersList.js'
import ClientsList from './ClientsList/ClientsList.js'
import OrderHistory from './OrderHistory/OrderHistory.js'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.js'

const routing = (
	<Router>
		<Switch>
			<Route exact path="/registerUser" component={AddUser} />
			<Route exact path="/login" component={Login} />

			<ProtectedRoute exact path="/" component={Dashboard} />
			<ProtectedRoute exact path="/aboutme" component={AboutMe} />
			<ProtectedRoute exact path="/addorder" component={AddOrder} />
			<ProtectedRoute exact path="/myorders" component={OrdersList} />
			<ProtectedRoute exact path="/history" component={OrderHistory} />
			<ProtectedRoute exact path="/clients" component={ClientsList} />
			<Route component={NotFound} />

		</Switch>
	</Router>
)

ReactDOM.render(routing, document.getElementById('root'))

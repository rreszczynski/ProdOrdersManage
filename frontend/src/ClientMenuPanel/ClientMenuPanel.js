import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


class ClientMenuPanel extends Component {
	constructor(props) {
		super(props);

		this.logout = this.logout.bind(this);
		this.showAboutMe = this.showAboutMe.bind(this);
		this.showAddOrder = this.showAddOrder.bind(this);
		this.showClientOrders = this.showClientOrders.bind(this);
	}

	// po kliknięciu w przycisk "wyloguj"
	logout() {
		sessionStorage.removeItem('accessToken');
		this.props.history.push("/login"); 
	}

	// po kliknięciu w przycisk "moje dane"
	showAboutMe() {
		this.props.history.push("/aboutme"); 
	}

	// po kliknięciu w przycisk "dodaj zlecenie"
	showAddOrder() {
		this.props.history.push("/addorder");		 
	}

	// po kliknięciu w przycisk "moje zlecenia"
	showClientOrders() {
		this.props.history.push("/myorders");		 
	}

	render() {
		return (
			<div className="row">
				<button className="three columns button-primary" onClick={this.showAboutMe}>Moje dane</button>
				<button className="three columns button-primary" onClick={this.showClientOrders}>Moje zlecenia</button>
				<button className="three columns button-primary" onClick={this.showAddOrder}>Dodaj zlecenie</button>
				<button className="three columns button-primary" onClick={this.logout}>Wyloguj</button>
			</div>
		)
	}
}

export default withRouter(ClientMenuPanel)
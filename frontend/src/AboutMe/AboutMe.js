import React, { Component } from 'react';
import HeaderPanel from '../HeaderPanel/HeaderPanel.js';
import FooterPanel from '../FooterPanel/FooterPanel.js';
import MenuPanel from '../MenuPanel/MenuPanel.js';
import './AboutMe.css';

class AboutMe extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: '',
		};

		this.getUser = this.getUser.bind(this);
	}

	getUser() {
		fetch('http://localhost:5000/users/getUser', {
			method: 'GET',
			headers: {
   				'Authorization':`Bearer ${sessionStorage.getItem('accessToken')}`,
   				'Content-type':'application/json'}
		})
		.then(res => res.json())
		.then(json => {
			json.createdAt = json.createdAt.split('T')[0];
			this.setState({ user: json })
		})
		.catch(error => console.log(error));
	}

	componentDidMount() {
		this.getUser();
	}

	render() {
		return (
			<div>
				<HeaderPanel />
				<MenuPanel />
				<div className="row"><h1 className="u-full-width">Profil użytkownika</h1></div>

				<div className="row row-highlight">
					<div className="four columns description">Login: </div><div className="eight columns value">{this.state.user.name}</div>
				</div>

				<div className="row row-highlight">
					<div className="four columns description">Firma: </div><div className="eight columns value">{this.state.user.companyName}</div>
				</div>

				<div className="row row-highlight">
					<div className="four columns description">NIP: </div><div className="eight columns value">{this.state.user.nip}</div>
				</div>

				<div className="row row-highlight">
					<div className="four columns description">Imię: </div><div className="eight columns value">{this.state.user.firstName}</div>
				</div>

				<div className="row row-highlight">
					<div className="four columns description">Nazwisko: </div><div className="eight columns value">{this.state.user.lastName}</div>
				</div>

				<div className="row row-highlight">
					<div className="four columns description">Data rejestracji: </div><div className="eight columns value">{this.state.user.createdAt}</div>
				</div>
				
				<FooterPanel />
			</div>
		)
	}

}

export default AboutMe
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import HeaderPanel from '../HeaderPanel/HeaderPanel.js';
import FooterPanel from '../FooterPanel/FooterPanel.js';
import add_user_picture from './adduser.png';

class AddUser extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			username: '',
			password: '',
			passwordConfirmed: '',
			firstName: '',
			lastName: '',
			companyName: '',
			nip: '',

			userIsloggedIn: false,
			errorMessage: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.validateNip = this.validateNip.bind(this);
	}

	componentDidMount() {
		if (sessionStorage.getItem('accessToken')) {
			this.setState({userIsloggedIn: true})
		}
	}

	// zmiany w polach formularza
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	// sprawdzenie czy wpiano poprawny nip w formularzu
	// źródło kodu: https://pl.wikibooks.org/wiki/Kody_%C5%BAr%C3%B3d%C5%82owe/Implementacja_NIP#Implementacja_algorytmu_w_j%C4%99zyku_JavaScript
	validateNip(nip) {
		var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
		nip = nip.replace(/[\s-]/g, '');
				   
		if (nip.length === 10 && parseInt(nip, 10) > 0) {
				var sum = 0;
				for(var i = 0; i < 9; i++){
						sum += nip[i] * weights[i];
				}                     
				return (sum % 11) === Number(nip[9]);
		}
		return false;
	}

	// TODO
	//dodanie klienta po wysłaniu formularza
	addUser = (e) => {
		e.preventDefault();
		//sprawdzenie czy poprawnie wpisano nip
		if(!this.validateNip(this.state.nip)) {
			this.setState( {errorMessage: "Podano niepoprawny NIP."})
		}
		else if(this.state.password !== this.state.passwordConfirmed) {
			this.setState( {errorMessage: "Hasła różnią się."})
		}
		else {
			fetch('http://localhost:5000/users/addClient', {
				method: 'POST',
				headers: { "Content-type": "application/json; charset=UTF-8" },
				body: JSON.stringify({
					username: this.state.username,
					password: this.state.password,
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					companyName: this.state.companyName,
					nip: this.state.nip
				})
			})
			.then(response => {
				if (response.status !== 200) {
					response.text()
					.then(text => (this.setState({ errorMessage: text })));
				}
				else {
					response.json()
					.then(json => {
						sessionStorage.setItem('accessToken', json.accessToken)
						this.setState( {userIsloggedIn: true});
					});
				}
			})
		}
	}

	render() {
		const errorMessage = this.state.errorMessage;

		if(!this.state.userIsloggedIn) {
			return (
				<div>
					<HeaderPanel />
					<div className="row u-center-abs">						
						<img id="user-image" src={add_user_picture} height="100" alt="Obraz - dodaj użytkownika" />

						<form onSubmit={this.addUser}>
							<div className="u-full-width">
								<label htmlFor="username">Użytkownik</label>
								<input className="u-full-width" type="text" placeholder="Użytkownik" name="username" required onChange={this.handleChange}/>
							</div>
						
							<div className="u-full-width">
								<label htmlFor="password">Hasło</label>
								<input className="u-full-width" type="password" placeholder="Hasło" name="password" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="password">Potwierdź Hasło</label>
								<input className="u-full-width" type="password" placeholder="Potwierdź Hasło" name="passwordConfirmed" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="firstName">Imię</label>
								<input className="u-full-width" type="text" placeholder="Imię" name="firstName" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="lastName">Nazwisko</label>
								<input className="u-full-width" type="text" placeholder="Nazwisko" name="lastName" required onChange={this.handleChange}/>
							</div>
						
							<div className="u-full-width">
								<label htmlFor="companyName">Nazwa firmy</label>
								<input className="u-full-width" type="text" placeholder="Nazwa firmy" name="companyName" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="lastName">NIP firmy</label>
								<input className="u-full-width" type="text" placeholder="NIP firmy" name="nip" required onChange={this.handleChange}/>
							</div>

							<div className="u-pull-right">
								<input className="button-primary" type="submit" value="Zarejestruj" />
							</div>
						</form>
						{errorMessage ? (
							<div className="errorMessage">
								{this.state.errorMessage}
							</div> ) : (null)
						}
		
					</div>
					<FooterPanel />
				</div>
			)	
		}
		else {
			return(<Redirect to='/dashboard' />)
		}
	}

}

export default AddUser
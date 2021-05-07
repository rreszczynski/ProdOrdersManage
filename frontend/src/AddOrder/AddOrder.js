import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import HeaderPanel from '../HeaderPanel/HeaderPanel.js';
import FooterPanel from '../FooterPanel/FooterPanel.js';
import MenuPanel from '../MenuPanel/MenuPanel.js';
import add_order_picture from './addOrder.png';
import './AddOrder.css';

class AddOrder extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			errorMessage: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	// zmiany w polach formularza
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	// kliknięcie przycisku "Anuluj"
	goBack() {
		this.props.history.push('/dashboard');
	}

	//dodanie zamówienia po wysłaniu formularza
	addOrder = (e) => {
		e.preventDefault();
		fetch('http://localhost:5000/orders/addOrder', {
			method: 'POST',
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization':`Bearer ${sessionStorage.getItem('accessToken')}`
			},
			body: JSON.stringify({
				rawMaterialName: this.state.rawmaterialname,
				rawMaterialMass: this.state.rawmaterialmass,
				rawMaterialPallets: this.state.rawmaterialpallets,
			})
		})
		.then(response => {
			if (response.status !== 200) {
				response.text()
				.then(text => (this.setState({ errorMessage: text })));
			}
			else {
				this.props.history.push('/OrdersList');
		}
		})	
	}

	render() {
		const errorMessage = this.state.errorMessage;
		return(
				<div>
					<HeaderPanel />
					<MenuPanel />
					<div className="row"><h1 className="u-full-width">Dodaj nowe zlecenie</h1></div>
					<div className="row u-center-abs">						
						<img id="user-image" src={add_order_picture} height="100" alt="Obraz - dodaj zlecenie" />
						<form onSubmit={this.addOrder}>
							<div className="u-full-width">
								<label htmlFor="rawmaterialname">Nazwa surowca</label>
								<input className="u-full-width" type="text" placeholder="Wprowadź nazwę surowca" name="rawmaterialname" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="rawmaterialmass">Masa surowca w [kg]</label>
								<input className="u-full-width" type="number" min="1000" step="0.01" placeholder="Wprowadź masę surowca, minimalna ilość: 1000,00 kg" name="rawmaterialmass" required onChange={this.handleChange}/>
							</div>

							<div className="u-full-width">
								<label htmlFor="rawmaterialpallets">Liczba palet z surowcem</label>
								<input className="u-full-width" type="number" min="0" step="1" placeholder="Podaj liczbę palet" name="rawmaterialpallets" required onChange={this.handleChange}/>
							</div>
							
							<div className="row">
								<input className="six columns button-primary" type="button" value="Anuluj" onClick={this.goBack}/>
								<input className="six columns button-primary" type="submit" value="Dodaj zlecenie" />
							</div>
						</form>	
					</div>
					{errorMessage ? (
						<div className="errorMessage">
							{this.state.errorMessage}
						</div> ) : (null)
					}
					<FooterPanel />
			</div>
		)
	}
}

export default withRouter(AddOrder)
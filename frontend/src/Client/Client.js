import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ClientAction from '../ClientAction/ClientAction.js';
import ROLES from '../helpers/roles.js';

class Client extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props
    }

    this.setStateInClient = this.setStateInClient.bind(this);
  }

  // ustawienie nowego statusu klienta po kliknięciu użytkownika w przycisk akcji
  setStateInClient(key, value) {
    this.setState({[key] : value});
    console.log(key, value);
  }

  render() {
    return (
      <tr>
        <td>{this.state.id}</td>
        <td>{this.state.companyName}</td>
        <td>{this.state.nip}</td>
        <td>{this.state.firstName}</td>
        <td>{this.state.lastName}</td>
        <td>{(this.state.isActive) ? ('Aktywny') : ('Zablokowany')}</td>
        
        {(this.state.userRole === ROLES.ADMIN) ? 
        (  <td><ClientAction
            isActive = {this.state.isActive}
            clientId = {this.state.id}
            setStateInClient = {this.setStateInClient}
            userRole = {this.state.userRole}
            />
          </td>
        ) : (null)}
      </tr>
    )
  }
}

export default withRouter(Client)
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ROLES from '../helpers/roles.js';
import './ClientAction.css';

class ClientAction extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isActive: '',
      errorMessage: '',
    };

    this.getActionText = this.getActionText.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }


  // tekst akcji na podstawie obecnego statusu
  getActionText(isActive) {
    if (this.state.isActive) {
      return 'Zablokuj'
    } else {
      return 'Aktywuj'
    }
  }

  // zmiana statusu klienta na przeciwny (np. aktywny -> zablokowany)
  changeStatus() {
    const clientId = this.props.clientId;

    fetch('http://localhost:5000/users/changeclientstatus', {
      method: 'POST',
      headers: {
        'Authorization':`Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-type':'application/json'
      },
      body: JSON.stringify({
        clientId: clientId
      })
    })
    .then(response => {
      if (response.status !== 200) {
        response.text()
        .then(text => this.setState({ errorMessage: text }));
      }
      else {
        this.setState({errorMessage : ''});
        const newStatus = !this.state.isActive;
        this.setState({isActive : newStatus});
        console.log(newStatus);

        this.props.setStateInClient('isActive', newStatus);
      }
    })
    .catch(error => this.setState({ errorMessage: 'Wystąpił błąd' }));
  }


  componentDidMount() {
    this.setState({ isActive : this.props.isActive });
  }


  render() {
    const action = this.getActionText(this.state.action);
    return (
      <div>
        {(this.props.userRole === ROLES.ADMIN) ?
          (<button className="ca-button" onClick={this.changeStatus}>{action}</button>)
        : (null)
        }
        <div className="ca-error">{this.state.errorMessage}</div>
      </div>
    )
  }
}

export default withRouter(ClientAction)
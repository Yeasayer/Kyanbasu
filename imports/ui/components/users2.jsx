import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';


class LogoContainer extends Component {
	
	renderLogged(user,logout){
		return(
			<div id="loggedin">
			<p>Hello, {user.username}</p>
			</div>
		)
	}
	renderLogin(){
		return(
			<div>
				<h1>WE ARE HERE FOR YOU</h1>
			</div>
		)
	}
	render(){
		const {user,logout} = this.props;
		return(
			<div className="loginmodal">
				<p>Hello!</p>
				{user? this.renderLogged(user,logout):this.renderLogin()}
			</div>
		)
	}
}

export default AccountsContainer;

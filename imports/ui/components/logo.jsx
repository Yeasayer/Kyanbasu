import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';


class LogoContainer extends Component {
	
	render(){
		const {user,logout} = this.props;
		return(
			<h1 id="titlelogo" className="sitefont1">KYANBASU</h1>
		)
	}
}

export default LogoContainer;

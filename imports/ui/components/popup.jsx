import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

class InfoPopUp extends Component{
	constructor(){
		super(props)
	}
	render(){
		return(
			<div id="infoback" className="background1">
				<div id="infomodalcontainer" className="background4 softradius">
				</div>
			</div>
		)
	}
}
export default createContainer(()=>{
	return{
		"we":"cool?"
	}
})
InfoPopUp.PropTypes = {
	"message":PropTypes.string.isRequired,
	"type":PropTypes.number.isRequired,
}
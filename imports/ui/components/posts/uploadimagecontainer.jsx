import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

class UploadImageContainer extends Component{

	render(){
		return(
			<div id="uploadimagecontainer" className=" background1 mediumcontainer softradius fntcolor1">
				<img className="simpleuploadimage" src={this.props.source} alt={this.props.imagename}/>
			</div>
		)
	}
}
export default createContainer(()=>{
	return{
		"we":"cool?"
	}
},UploadImageContainer);
UploadImageContainer.PropTypes = {
	source: PropTypes.string.isRequired,
	imagename: PropTypes.string.isRequired
}

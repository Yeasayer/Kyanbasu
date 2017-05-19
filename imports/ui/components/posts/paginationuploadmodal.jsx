import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import Anime from 'react-anime';

class ImageSelectModal extends Component{
	renderImageButtons(){

	}
	render(){
		return(
			<div className="easyflex centerflex">
			</div>
		)
	}
}
export default createContainer(()=>{
	return{
		"some":"Object"
	}
},ImageSelectModal)
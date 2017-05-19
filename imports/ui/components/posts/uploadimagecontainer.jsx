import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import Anime from 'react-anime';

class UploadImageContainer extends Component{

	render(){
		return(
			<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
				<img className="simpleuploadimage background1 softradius" src={this.props.source} alt={this.props.imagename}/>
			</Anime>
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

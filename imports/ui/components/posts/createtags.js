import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';

export default class CreateTags extends Component{
	render(){
		return(
			<li className={this.generateTagsClass()}>
		)
	}
}
CreateTags.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  tag: PropTypes.object.isRequired,
};
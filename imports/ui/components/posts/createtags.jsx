import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';

class CreateTags extends Component{
	getClasses(){

	}
	render(){
		console.log(this.props)
		return(
		<li className={this.props.css}><span className="taginline">{this.props.tag.count} {this.props.tag.tagname}</span><span className="canceltag" onClick={()=>this.props.delFunction(this.props.key,this.props.parent)}>⨉</span></li>
		)
	}
}
export default createContainer(()=>{
	return{
		"we":"cool?"
	}
},CreateTags);
CreateTags.propTypes = {
  tag: PropTypes.object.isRequired,
  css: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  key: PropTypes.number.isRequired,
};
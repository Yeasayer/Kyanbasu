import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import Anime from 'react-anime';
class InfoPopUp extends Component{
	constructor(){
		super(props)
	}
	getClasses(){
		var fntcolors = {
			0:"fntcolorok",
			1:"fntcolorwarn",
			2:"fntcolorerr",
		}
		return fntcolor[this.props.type]
	}
	render(){
		return(
			<Anime opacity={[0, 1]} delay={(e, i) => i * 400}>
			<div id="infoback" className="background1">
				<div id="infomodalcontainer" className={"background4 softradius "+this.getClasses()}>
					<h1 className="fntsizelarge autocenter fntcenter sitefont1">{this.props.headmessage}</h1>
					<p className="fntsizemid fntcenter autocenter sitefont2">{this.props.bodymessage}</p>
					<button className="buttonpadding autocenter" onClick={()=>this.props.delFunction()}>{this.props.buttonmessage}</button>
				</div>
			</div>
			</Anime>
		)
	}
}
export default createContainer(()=>{
	return{
		"we":"cool?"
	}
})
InfoPopUp.PropTypes = {
	"headmessage":PropTypes.string.isRequired,
	"bodymessage":PropTypes.string,
	"buttonmessage":PropTypes.string.isRequired,
	"type":PropTypes.number.isRequired,
}
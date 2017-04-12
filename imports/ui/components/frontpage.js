import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';

class FrontPageContainer extends Component{
	render(){
		return(
			<div id="coolBackground">
				<div className="background1 largecontainer">
					<h1 className="sitefont1 fntsizelarge fntcenter">Welcome to Kyanbasu</h1>
					<p className="sitefont2 fntsizemid">This is a cool thing!</p>
				</div>
			</div>
		)
	}

}
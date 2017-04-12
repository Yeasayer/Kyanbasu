import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';

class FrontPageContainer extends Component{
	render(){
		return(
			<Anime opacity={[0, 1]} translateY={'4em'} delay={(e, i) => i * 200}>
			<div id="coolBackground">
				<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
				<div className="background1 largecontainer softradius fntcolor1">
					<h1 className="sitefont1 fntsizelarge fntcenter fntspacesmall">Welcome to Kyanbasu!</h1>
					<p className="sitefont2 fntsizesmall">This is a cool thing!</p>
				</div>
				</Anime>
			</div>
			</Anime>
		)
	}

}
export default FrontPageContainer;
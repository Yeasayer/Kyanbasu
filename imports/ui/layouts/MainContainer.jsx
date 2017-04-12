import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';


import AccountsContainer from '../components/users.jsx';
import LogoContainer from '../components/logo.jsx';


const FrontContainer = ({content}) =>(
	<div>
		<header className="navigation fntcolor1 background1">
			<div className="linkscontainer sitefont1 fontsizesmall">
				<a href="/">HOME</a>
				<a href="/posts">POSTS</a>
			</div>
			<LogoContainer/>
			<AccountsContainer/>
		</header>
		{content()}
	</div>
)

export default FrontContainer;
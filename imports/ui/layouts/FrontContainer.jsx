import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const FrontContainer = ({content}) =>(
	<div>
		<div className="navigation">
			<a href="/">HOME</a>
		</div>
		<h1>This should werk!</h1>
		{content}
	</div>
)

export default FrontContainer;
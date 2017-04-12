import React from 'react';
import { HashRouter as Router, Route } from 'react-router';

import FrontContainer from '../../ui/containers/FrontContainer.jsx';
console.log("DERP!")
export const renderRoutes = () =>{
	return(
	<Router>
		<Route path="/" component={FrontContainer}/>
	</Router>
	)
}
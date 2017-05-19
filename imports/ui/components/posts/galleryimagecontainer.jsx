import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import Anime from 'react-anime';

class GalleryImageContainer extends Component{

	render(){
		console.log(this.props)
		return(
			<Anime opacity={[0, 1]} translateY={'2rem'} delay={(e) => {return this.props.lazyNum * 100}}>
				{this.props.isLink?<a href={'/posts/image/'+this.props.id}><img className="galleryimage background1 softradius" src={'/images/uploads/'+this.props.source} alt={this.props.imagename}/></a>:<img className="fullimage background1 softradius" src={'/images/uploads/'+this.props.source} alt={this.props.imagename}/>}
			</Anime>
		)
	}
}
export default createContainer(()=>{
	return{
		"we":"cool?"
	}
},GalleryImageContainer);
GalleryImageContainer.PropTypes = {
	source: PropTypes.string.isRequired,
	imagename: PropTypes.string.isRequired,
	isLink: PropTypes.bool.isRequired,
	id:PropTypes.string.isRequired,
	lazyNum:PropTypes.number.isRequired,
}

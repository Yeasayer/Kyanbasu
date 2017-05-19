import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import Anime from 'react-anime';

import TagParser from '../../../utilities/TagParser.js';
import TagUpdater from '../../../utilities/TagUpdater.js'
import CreateTags from './createtags.jsx';
import GalleryImageContainer from './galleryimagecontainer.jsx';

import {Images} from "../../../api/posts.jsx";

class FixDataBaseContainer extends Component{
	fixImages(){
		let imgArr = this.props.image
		for (var img in imgArr){
			let shortImg = imgArr[img]
			Meteor.call('imgtags.insert',shortImg.meta,shortImg._id,shortImg.extensionWithDot)
		}
	}
	render(){
		return(
			<h1>Just console.log things!{this.props.image.length?this.fixImages():'Nothing here bud!'}</h1>
			
		)
	}
}

export default createContainer(()=>{
	return{
		currentUser:Meteor.user(),
		image:Images.find({}).fetch(),
	}
},FixDataBaseContainer)
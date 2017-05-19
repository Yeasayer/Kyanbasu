import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import Anime from 'react-anime';

import TagParser from '../../../utilities/TagParser.js';
import CreateTags from './createtags.jsx';
import GalleryImageContainer from './galleryimagecontainer.jsx';

import {Images} from "../../../api/posts.jsx";

class OverGalleryViewContainer extends Component{
	constructor(props){
		super(props)
		console.log(this.props.posts,this.props);
		let lazyCheck = this.props
	}
	renderTheImages(){
		let returnArr = []
		for(var image in this.props.posts){
			let shortImage = this.props.posts[image]
			console.log(shortImage,shortImage.url,image)
			returnArr.push(<GalleryImageContainer key={image+1} lazyNum={parseInt(image)+1} id={shortImage._id} isLink={true} source={shortImage._id+shortImage.extensionWithDot} imagename={shortImage.name}/>)
		}
		return returnArr
	}
	render(){
		return(
			<div id="gallerycontainer" className="easyflex easywrap autocenter autoclear flexcenter">
				{this.props.posts.length?this.renderTheImages():''}
			</div>
		)
	}
}

export default createContainer(({tagparse})=>{
	if (!tagparse.tags){
		return{
			currentUser:Meteor.user(),
			posts:Images.find({}).fetch(),
			searchedTags:finalTags,
		}
	}
	let lazyTagObj = {}
	let searchTags = new TagParser(tagparse.tags.replace(/_/g," "),lazyTagObj,0)
	let finalTags = searchTags.flattenTags()
	let imgArr = [false]
	let counter = 0
	let parentCount = Object.keys(finalTags).length
	/*for (var tagParents in finalTags){
		let something = ((finalTags,tagParents)=>{
			let iffyArr = []
			finalTags[tagParents].forEach((x,i)=>{
				let searchObj = {meta:{tags:{descriptors:{}}}};
				searchObj.meta.tags.descriptors[tagParents] = x.tagname
				console.log(imgArr,JSON.stringify(searchObj));
				iffyArr.push(searchObj)
				//Note that I totally fucked this up and I kinda regret not using a relational database...
			})
			return iffyArr
		})(finalTags,tagParents)
		imgArr = imgArr.concat(something)
		console.log(imgArr,something);
		counter++;
	}*/
	if (counter === parentCount){
		//Because .concat really fucking sucks and I need at least one value to concat.
		imgArr.shift()
		return{
			currentUser:Meteor.user(),
			posts:Images.find({$and:imgArr}).fetch(),
			searchedTags:finalTags,
		}
	}
},OverGalleryViewContainer)

OverGalleryViewContainer.propTypes = {
	tagparse:PropTypes.object,
	mainimgid:PropTypes.string,
}

//Yeah, this whole reactive state bullshit fucking pisses me the literal fuck off.
var loadTheFuckingImagesAlready = (finalTags) =>{
	let imgArr = []
	for (var tagParents in finalTags){
		finalTags[tagParents].forEach((x,i)=>{
			let searchObj = {}
			searchObj["meta.tags.descriptors."+tagParents+'.'+i+".tagname"] = x.tagname

			imgArr.join(Images.find(searchObj))
			console.log(imgArr,JSON.stringify(searchObj));
		})
	}
}
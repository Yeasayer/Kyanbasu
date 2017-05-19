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

class SingleImageContainer extends Component{
	constructor(props){
		super(props)
		console.log(this.props);
	}
	
	renderTheImage(){
		let imgThing = this.props.image
		return (
			<GalleryImageContainer key={1} lazyNum={1} id={imgThing._id}  isLink={false} source={imgThing._id+imgThing.extensionWithDot} imagename={imgThing.name}/>
		)
	}
	updateScore(upDownBool,tagIndex,parent){
		let preObj = this.props.image
		let preScore = 0
		//Very lazy check for score number, need to incorporate into uploaded tags.
		if (!preObj.meta.tags.descriptors[parent][tagIndex]["score"]){
			preScore = 0
		} else {
			preScore = preObj.meta.tags.descriptors[parent][tagIndex]["score"]
		}
		if (upDownBool){
			preObj.meta.tags.descriptors[parent][tagIndex]["score"] = preScore+1
		} else {
			preObj.meta.tags.descriptors[parent][tagIndex]["score"] = preScore-1
		}
		let builder = "meta.tags.descriptors."+parent+"."+tagIndex+".score"
		Images.update({_id:this.props.image._id},preObj)
			

	}
	renderTags(){
		let tagEasyObj = this.props.image.meta.tags.descriptors
		let tagArr = []
		let keyCount = 0
		for (var tagparent in tagEasyObj){
			let tagShorter = tagEasyObj[tagparent]
			let subTagArr = []
			let classcolors = {
				female:"backgroundfemale",
				male:"backgroundmale",
				general:"background7",
				series:"backgroundmedia",
				technical:"background3",
				clothing:"background5",
				gender:"backgroundgender",
				franchise:"backgroundmedia",
				character:"background8",
				language:"background2",
				object:"background2",
				species:"backgroundspecies",
				action:"background8",
			}
			let falseKey = keyCount
			var easycss = "sitefont2 tagbubble "+classcolors[tagparent]
			if (!tagShorter.length)continue;
			let spliceThing = tagShorter.map((tag,i)=>{
				keyCount++;
				let trueKey = tagparent
				let coolhtml = (<CreateTags key={keyCount} createPost={false} css={easycss} tag={tag} voteUp={keyCount => this.updateScore(true,i,trueKey)} voteDown={keyCount => this.updateScore(false,i,trueKey)} parent={tagparent}/>)
				subTagArr.push(coolhtml)
			})
			tagArr.push(<div className="tagcategorycontainer fntcolor1">
						<p className="sitefont1 fntcolor1 fntsizesmall fntcenter">{tagparent+":"}</p>
						<ul className="taglist autocenter">{subTagArr}</ul>
						</div>)
		}
		return (
			<div className="mediumcontainer background1">
			{tagArr}
			</div>
		)
	}
	render(){
		return(
			<div id="singlecontainer" className="easyflex easywrap autocenter autoclear flexcenter">
			{this.props.image?this.renderTheImage():''}
			{this.props.image?this.renderTags():''}
			</div>
		)
	}
}

export default createContainer(({mainimgid})=>{
	const daImage = Images.find({_id:mainimgid}).fetch()
	return{
		currentUser:Meteor.user(),
		image:daImage[0],
	}
},SingleImageContainer)

SingleImageContainer.propTypes = {
	tagparse:PropTypes.object,
	mainimgid:PropTypes.string,
}
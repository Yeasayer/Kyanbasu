import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';
import CreateTags from './createtags.jsx';
import TagParser from '../../../utilities/TagParser.js';

class PostsCreateContainer extends Component{
	constructor(props){
 		super(props);

		this.state = {
			file:'',
			imagePreviewUrl: '',
			tags: {
				descriptors:{
					general:[]
				},
				artist:'',
				ageRating:1,
				parentGalery:'',
				source:'',
			},
		}
	}
	uploadImage(e){
		e.preventDefault()
		var imagestuffs = e.target;
		console.log("YAY ",imagestuffs)
	}
	checkImage(e){
		let reader = new FileReader();
    	let file = e.target.files[0];
    	console.log(reader,file)

	    reader.onloadend = () => {
	      this.setState({
	        file: file,
	        imagePreviewUrl: reader.result,
	        imageReady:true
	      });
	      console.log(this.state)
	    }
	    reader.readAsDataURL(file)
	}
	updateArtist(e){
		if (e.keyCode == 13){
			e.preventDefault();
			var tagObj = this.state.tags;
			var artist = ReactDOM.findDOMNode(this.refs.ImageArtist).value.trim()
			tagObj.artist = artist;
			this.setState({
				tags: tagObj
			})
			console.log(this.state)
			ReactDOM.findDOMNode(this.refs.ImageArtist).value = ''
		}
	}
	updateAge(e){
		this.setState({
			tags:{
				ageRating:parseInt(e.target.value)
			}
		})
		console.log(this.state)
	}
	updateSource(e){
		if (e.keyCode == 13){
			e.preventDefault();
			var tagObj = this.state.tags;
			tagObj.source = ReactDOM.findDOMNode(this.refs.ImageSource).value.trim()
			console.log(e.target.value,typeof(sauce))
			this.setState({
				tags: tagObj
			})
			ReactDOM.findDOMNode(this.refs.ImageSource).value = ''
		}
	}
	//Tag updating
	deleteTag(tagid,parent){
		var tagObj = this.state.tags.descriptors
		console.log(this.state,tagObj,tagid,parent)
		for (var goodbye in tagObj[parent]){
			console.log(tagObj[parent][goodbye])
			if (tagObj[parent][goodbye]._id === tagid){
				tagObj[parent].splice(goodbye,1)
				if (tagObj[parent].length === 0){
					delete tagObj[parent];
				}
				break;
			}
		}
		this.setState({
			tags:{
				descriptors:tagObj
			}
		})
		console.log(this.state,tagObj)
	}
	updateTags(e){
		if (e.keyCode == 13){
			e.preventDefault();
			var tag = ReactDOM.findDOMNode(this.refs.ImageTags).value.trim()
			var tagObj = this.state.tags;
			var desObj = tagObj.descriptors
			console.log(tag)
			var cooltags = new TagParser(tag,tagObj)
			/*this.setState({tags:tagObj})
			console.log(this.state);
			ReactDOM.findDOMNode(this.refs.ImageTags).value = '';*/

		}
	}
	renderTagGenerator(){

		if (Object.keys(this.state.tags.descriptors).length === 1 && this.state.tags.descriptors.general.length === 0){return ""}

		else{
			returnarr = []
			let increment = 0;
			let classcolors = {
				female:"backgroundfemale",
				male:"backgroundmale",
				general:"background7",
				media:"backgroundmedia",
				character:"background8",
				language:"background2",
			}
		
			for (var key in this.state.tags.descriptors){
				let shortarr = this.state.tags.descriptors[key];
				var basecontainer = shortarr.map((tag)=>{
					var easycss = "tagbubble "+classcolors[key]
					var truparent = key
					return (
						//Note that this is starting to get really confusing... :\
						<CreateTags key={tag._id} parent={key} tag={tag} css={easycss} delFunction={key => this.deleteTag(tag._id,truparent)}/>
					)
				})
				returnarr.push((
					<div className="tagcategorycontainer">
						<p className="sitefont1 fntsizesmall fntcenter">{key}</p>
						<ul className="taglist">
							<Anime scale={[0,1]} delay={(e, i) => i * 300}>
							{basecontainer}
							</Anime>
						</ul>
					</div>
				))
			}
		}
		return returnarr;
	}
	//Rendering components
	renderImage(){
		console.log("THIS SHOULDN'T BE HERE")
		return(
				<div className=" background1 mediumcontainer softradius fntcolor1">
					<image className="simpleuploadimage" src={this.state.imagePreviewUrl} alt={"Your uploaded image!"}/>
				</div>
		)
	}
	renderImageDataForm(){
		return(
			<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
			<form id="dataimageform" className="imageuploadform scrollform mediumcontainer background1 sitefont2 fntcolor1 autocenter" method="POST" encType="multipart/form-data" ref="imageform">
				<label htmlFor="artist" className="fntcenter fntsizesmall">Who's the artist?</label>{this.state.tags.artist?<div className="okaycircle autocenter background5 sitefont1 fntsizemid">OK!</div>:''}
				<input type="text" name="artist" ref="ImageArtist" className="fntsizesmall fntcolor1" onKeyDown={this.updateArtist.bind(this)} placeholder="Picasso?"/>
				<label htmlFor="source" className="fntcenter fntsizesmall">Do you have a source?</label>
				<input type="text" name="source" ref="ImageSource" className="fntsizesmall fntcolor1" onKeyDown={this.updateSource.bind(this)} placeholder="Sauce?"/>
				<label htmlFor="tags" className="fntcenter fntsizesmall">What tags can you describe the image with?</label>
				<p htmlFor="tags" className="fntcenter fntsizexsmall">Examples include stuff like "2 girls", "green eyes", "blush", "$language:Japanese", "$male:glasses".<br/>You can either press enter after every tag, or seperate them by commas.</p>
				<input type="text" name="tags" ref="ImageTags" className="fntsizesmall fntcolor1" onKeyDown={this.updateTags.bind(this)} placeholder="What's it all about?"/>
				{this.renderTagGenerator()}
				<label htmlFor="agerating" className="fntcenter fntsizesmall">What do you think this image is appropriate for?</label>
				<p htmlFor="agerating" className="fntcenter fntsizexsmall">Note that this is very important and deliberately mislabling images as the incorrect rating is grounds for banning.</p>
					<div className="ageradiocontainer background5 softradius easyflex centerflex lazyflexinline"><input type="radio" name="agerating" ref="AgeRating" value="0" onClick={this.updateAge.bind(this)}/><p className="sitefont1">All Ages: <span className="sitefont2">The image in question should be appropriate to view for everyone, with <span className="fntbld">no</span> (or extremely minimal) objectionable content.</span></p></div>
  					<div className="ageradiocontainer softradius background6 easyflex lazyflexinline"><input type="radio" name="agerating" ref="AgeRating" value="1" onClick={this.updateAge.bind(this)} defaultChecked/><p className="sitefont1">R-12: <span className="sitefont2">This is the default category for any image. You should pick this if your image has some mildly objectionable content in it.</span></p></div>
					<div className="ageradiocontainer background7 softradius easyflex lazyflexinline"><input type="radio" name="agerating" ref="AgeRating" value="2" onClick={this.updateAge.bind(this)}/><p className="sitefont1">R-15: <span className="sitefont2">This is the PG-13/Light R rating right here. Select this if your image is dicier that an R-12, but not explict enough for an R-18 rating.</span></p><br/></div>
					<div className="ageradiocontainer background8 softradius easyflex lazyflexinline"><input type="radio" name="agerating" ref="AgeRating" value="3" onClick={this.updateAge.bind(this)}/><p className="sitefont1">R-18: <span className="sitefont2">This is for all those lewd (or at least lewder than the above ratings) or extremely violent images go!</span></p></div>
				<input type="submit" name="entrybutton" className="fntsizesmall sitefont1" onClick={this.uploadImage.bind(this)} value="Let's Show The World!"/>
			</form>
			</Anime>
		)
	}
	render(){
		let {imagePreviewUrl} = this.state
		let $imagePreview = null
		if (imagePreviewUrl){
			$imagePreview = ''
		} else {
			$imagePreview = ''
		}
		return(
			<Anime opacity={[0, 1]} translateY={'4em'} delay={(e, i) => i * 200}>
			<div id="coolBackground">
				
				<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
					<form id="postimageform" className="imageuploadform background1 sitefont2 fntcolor1 autocenter" onSubmit={this.uploadImage.bind(this)} method="POST" encType="multipart/form-data" ref="imageform">
						<label htmlFor="image" className="fntcenter fntsizesmall">What's your name?</label>
						<input type="file" className="fntsizesmall" ref="Image" onChange={this.checkImage.bind(this)} name="image" placeholder="Come on!"/>
					</form>
				</Anime>
				<div className="easyflex centerflex">
				{this.state.imagePreviewUrl?
					<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
						<div id="uploadimagecontainer" className=" background1 mediumcontainer softradius fntcolor1">
							<img className="simpleuploadimage" src={this.state.imagePreviewUrl} alt={"Your uploaded image!"}/>
						</div>
					</Anime>:''}
				{this.state.imagePreviewUrl?this.renderImageDataForm():""}
				</div>
			</div>
			</Anime>
		)
	}

}

export default createContainer(()=>{
	return{
		currentUser:Meteor.user(),
	}
},PostsCreateContainer);
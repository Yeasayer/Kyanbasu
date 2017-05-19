import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import Anime from 'react-anime';

//Local Scripts and stuff
import CreateTags from './createtags.jsx';
import InfoPopUp from '../popup.jsx';
import TagParser from '../../../utilities/TagParser.js';
import UploadFormChecker from '../../../utilities/UploadFormChecker.js';
import UploadImageContainer from './uploadimagecontainer.jsx';

//DB Scripts
import {Images} from "../../../api/posts.jsx";

class PostsCreateContainer extends Component{
	constructor(props){
 		super(props);

		this.state = {
			images:[],
			imageReady:false,
			uploadingImages:false,
			uploadComplete:false,
			imageCount:0,
		}
	}
	uploadImage(){
		var files = this.state.images
		console.log(Images,files)
		for(var i = 0;i < files.length;i++){
			let fileId = ''
			let that = this;
			var weDidIt = Images.insert({
				file:files[i].imagePreviewUrl,
				meta:{
					tags:files[i].tags,
					uploader_id:this.props.currentUser.username,
					uploadedOn:new Date(),
				},
				isBase64:true,
				chunkSize:'dynamic',
				fileName:files[i].filename,
			},false)
			weDidIt.on('start',function(){
				console.log(weDidIt,"YAY! (^o^)");
			})
			weDidIt.on('end',function(error,fileObj){
				console.log(arguments);
				if(error){
					alert("WHOOPS IT FAILED DUDE! ;_;")
				} else {
					console.log(that);
					that.uploadTag(fileObj.meta,fileObj._id)
					alert('File "' + fileObj.name + '" successfully uploaded')
					e.preventDefault();
					//fileId = fileObj._id
					

				}
			})
			weDidIt.start(this,files[i])

		}
	}
	uploadTag(tags,id){
		//Confusing but makes sense with the rewrite.
		for (var parent in tags.tags.descriptors){
			tags.tags.descriptors[parent].forEach((x,i)=>{
				Meteor.call('tags.update',x,true);
			})
		}
		Meteor.call('imgtags.insert',tags,id)
	}

	//Checking the uploaded image.
	checkImage(e){
		let readerArr = []
    	let images = e.target.files
    	let imageindex = this.state.imageCount
    	if(this.state.imageCount){
    		imageindex++
    	}
	    for (var i = 0;i < images.length;i++){
	    	//IIFE (or Iffy! JK Neptunia games are hella bad!) to invoke file reader on all of the files!
	    	console.log(images[i],imageindex,this.state);
	    	((coolfile,index)=>{
		    	let reader = new FileReader();
		    	reader.onloadend = () => {
			      var imageStateObj = this.state.images
			      imageStateObj[index]={
			      		filename: coolfile.name,
			        	imagePreviewUrl: reader.result,
			        	tags: {
							descriptors:{
								general:[]
							},
							tagcount:0,
							artist:'',
							title:'',
							ageRating:1,
							parentGalery:null,
							source:'',
							uploader:this.props.currentUser.username,
						},
						filesize:coolfile.size,
			      }
			      if(!index){
			      	imageStateObj[index]["imageModalVisible"]=true
			      } else {
			      	imageStateObj[index]["imageModalVisible"]=false
			      }
			      console.log(index,coolfile.name,this.state.imageCount)
			      this.setState({
			        images:imageStateObj,
			      })
			      if(index+1 == images.length){
			      	this.setState({
			      		imageReady:true
			      	})
			      }
			    }
		    	reader.readAsDataURL(coolfile)
	    	})(images[i],imageindex)
	    	imageindex++;
	    }
	    this.setState({
	    	imageCount:this.state.images.length
	    })
	}
	updateArtist(index,e){
		if (e.keyCode == 13){
			e.preventDefault();
			var imgObj = this.state.images
			var artist = ReactDOM.findDOMNode(this.refs["ImageArtist"+index]).value.trim()
			imgObj[index].tags.artist = artist;
			this.setState({
				images: imgObj
			})
			console.log(this.state)
			ReactDOM.findDOMNode(this.refs["ImageArtist"+index]).value = ''
		}
	}
	updateAge(index,e){

		var imgObj = this.state.images
		imgObj[index].tags.ageRating = parseInt(e.target.value)
		this.setState({
			images:imgObj
		})
		console.log(this.state)
	}
	updateSource(index,e){
		if (e.keyCode == 13){
			e.preventDefault();
			var tagObj = this.state.images;
			tagObj[index].tags.source = ReactDOM.findDOMNode(this.refs["ImageSource"+index]).value.trim()
			this.setState({
				images: tagObj
			})
			ReactDOM.findDOMNode(this.refs["ImageSource"+index]).value = ''
		}
	}
	//Info box stuff (Need to fix.)
	deleteInfoBox(){
		if (this.state.uploadingImages){
			this.setState({
				uploadingImages:!uploadingImages,
			})
		}
	}
	//Tag updating
	deleteTag(tagid,parent,parentindex){
		var tagObj = this.state.images
		console.log(this.state,tagObj,tagid,parent)
		for (var goodbye in tagObj[parentindex].tags.descriptors[parent]){
			console.log(tagObj[parentindex].tags)
			if (tagObj[parentindex].tags.descriptors[parent][goodbye].tag_id === tagid){
				tagObj[parentindex].tags.descriptors[parent].splice(goodbye,1)
				if (tagObj[parentindex].tags.descriptors[parent].length === 0){
					delete tagObj[parentindex].tags.descriptors[parent];
				}
				break;
			}
		}
		this.setState({
			images:tagObj
		})
		console.log(this.state,tagObj)
	}
	updateTags(index,e){
		if (e.keyCode == 13){
			e.preventDefault();
			var tag = ReactDOM.findDOMNode(this.refs["ImageTags"+index]).value.trim()
			var tagObj = this.state.images
			var desObj = tagObj[index].tags.descriptors
			var cooltags = new TagParser(tag,tagObj[index].tags.descriptors,tagObj[index].tags.tagcount)
			var newtags = cooltags.flattenTags()
			tagObj[index].tags.descriptors = newtags
			tagObj[index].tags.tagcount = cooltags.getTagCount()
			this.setState({images:tagObj})
			ReactDOM.findDOMNode(this.refs["ImageTags"+index]).value = '';

		}
	}
	renderTagGenerator(index){
		console.log(this.state.images,index)
		if (Object.keys(this.state.images[index].tags.descriptors).length === 1 && this.state.images[index].tags.descriptors.general.length === 0){return ""}

		else{
			returnarr = []
			let increment = 0;
			let tagshortner = this.state.images[index];
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
		
			for (var key in tagshortner.tags.descriptors){
				let shortarr = tagshortner.tags.descriptors[key];
				if (shortarr === undefined)shortarr = "background2";
				var basecontainer = shortarr.map((tag)=>{
					var easycss = "tagbubble "+classcolors[key]
					var truparent = key
					return (
						//Note that this is starting to get really confusing... :\
						<CreateTags key={tag.tag_id} parent={key} tag={tag} createPost={true} css={easycss} delFunction={key => this.deleteTag(tag.tag_id,truparent,index)}/>
					)
				})
				returnarr.push((
					<div className="tagcategorycontainer">
						<p className="sitefont1 fntsizesmall fntcenter">{key}</p>
						<ul className="taglist autocenter">
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
	//Main Image Flex Render
	renderImageFlexContainers(){
		containerArr = []
		for (var image in this.state.images){
			var imagebasecontainer = ((daImage,index)=>{
				return(
					<UploadImageContainer key={index} source={daImage.imagePreviewUrl} imagename={daImage.name}/>
				)
			})(this.state.images[image],image)
			var imageformcontainer = this.renderImageDataForm(this.state.images[image],image)
			var seriously = this.state.images[image].imageModalVisible?(<div className="easyflex easywrap centerflex">{imagebasecontainer}{imageformcontainer}</div>):""
			containerArr.push(seriously)
		}
		containerArr.push((<button className="fntsizesmall sitefont1 background1 buttonpadding autocenter fntcolor1 softradius noborder" onClick={this.uploadImage.bind(this)}>Let's Show The World!</button>))
		return containerArr
	}
	renderImageDataForm(imageinfo,index){
		return(
			<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
			<form id="dataimageform" className="imageuploadform scrollform mediumcontainer background1 sitefont2 fntcolor1 autocenter" method="POST" encType="multipart/form-data" ref="imageform">
				<label htmlFor="artist" className="fntcenter fntsizesmall">Who's the artist?</label>{imageinfo.tags.artist?<div className="okaycircle autocenter background5 sitefont1 fntsizemid">OK!</div>:''}
				<input type="text" name="artist" ref={"ImageArtist"+index} className="fntsizesmall fntcolor1" onKeyDown={this.updateArtist.bind(this,index)} placeholder="Picasso?"/>
				<label htmlFor="source" className="fntcenter fntsizesmall">Do you have a source?</label>
				<input type="text" name="source" ref={"ImageSource"+index} className="fntsizesmall fntcolor1" onKeyDown={this.updateSource.bind(this,index)} placeholder="Sauce?"/>
				<label htmlFor="tags" className="fntcenter fntsizesmall">What tags can you describe the image with?</label>
				<textarea type="text" name="tags" ref={"ImageTags"+index} className="fntsizesmall fntcolor1" onKeyDown={this.updateTags.bind(this,index)} placeholder="What's it all about?"/>
				{this.renderTagGenerator(index)}
				<label htmlFor="agerating" className="fntcenter fntsizesmall">What do you think this image is appropriate for?</label>
				<p htmlFor="agerating" className="fntcenter fntsizexsmall">Note that this is very important and deliberately mislabling images as the incorrect rating is grounds for banning.</p>
					<div className="ageradiocontainer background5 softradius easyflex centerflex lazyflexinline"><input type="radio" name="agerating" ref={"AgeRating"+index} value="0" onClick={this.updateAge.bind(this,index)}/><p className="sitefont1">All Ages: <span className="sitefont2">The image in question should be appropriate to view for everyone, with <span className="fntbld">no</span> (or extremely minimal) objectionable content.</span></p></div>
  					<div className="ageradiocontainer softradius background6 easyflex lazyflexinline"><input type="radio" name="agerating" ref={"AgeRating"+index} value="1" onClick={this.updateAge.bind(this,index)} defaultChecked/><p className="sitefont1">R-12: <span className="sitefont2">This is the default category for any image. You should pick this if your image has some mildly objectionable content in it.</span></p></div>
					<div className="ageradiocontainer background7 softradius easyflex lazyflexinline"><input type="radio" name="agerating" ref={"AgeRating"+index} value="2" onClick={this.updateAge.bind(this,index)}/><p className="sitefont1">R-15: <span className="sitefont2">This is the PG-13/Light R rating right here. Select this if your image is dicier that an R-12, but not explict enough for an R-18 rating.</span></p><br/></div>
					<div className="ageradiocontainer background8 softradius easyflex lazyflexinline"><input type="radio" name="agerating" ref={"AgeRating"+index} value="3" onClick={this.updateAge.bind(this,index)}/><p className="sitefont1">R-18: <span className="sitefont2">This is for all those lewd (or at least lewder than the above ratings) or extremely violent images go!</span></p></div>
			</form>
			</Anime>
		)
	}
	//Main Render
	render(){
		const isUploading = this.state.uploadingImages
		return(
			<Anime opacity={[0, 1]} translateY={'4em'} delay={(e, i) => i * 200}>
			<div id="coolBackground">
				
				<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 400}>
					<form id="postimageform" className="imageuploadform background1 sitefont1 fntcolor1 autocenter" onSubmit={this.uploadImage.bind(this)} method="POST" encType="multipart/form-data" ref="imageform">
						<label htmlFor="image" className="fntcenter fntsizesmall">Upload your files here!</label>
						<input type="file" className="fntsizesmall" ref="ImageUploadDOM" onChange={this.checkImage.bind(this)} name="image" placeholder="Come on!" multiple/>
					</form>
				</Anime>
				{this.state.imageReady?this.renderImageFlexContainers():''}
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
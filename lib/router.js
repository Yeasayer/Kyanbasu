import React from 'react';
import {mount} from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

//Layout Container
import FrontContainer from '../imports/ui/layouts/MainContainer.jsx';

//Front Page Container
import FrontPageContainer from '../imports/ui/components/frontpage.jsx';

//Posting Containers
import OverGalleryViewContainer from '../imports/ui/components/posts/gallerycontainer.jsx';
import SingleImageContainer from '../imports/ui/components/posts/normalimagecontainer.jsx';
import PostsCreateContainer from '../imports/ui/components/posts/upload.jsx';

//Debug/Lazy Fix Containers
import FixDataBaseContainer from '../imports/ui/components/posts/fixdatabase.jsx';

//Mongo collections because fuck node!
import {Images} from "../imports/api/posts.jsx";

//Route groups!

//Front page!
FlowRouter.route('/',{
	name:"homepage",
	action: function(params,queryParams){
		mount(FrontContainer,{
			content:()=>(<FrontPageContainer />)
		})
	},
})

//Post section and groups!
var postGroups = FlowRouter.group({
	prefix:"/posts",
	name:"posts",
})
postGroups.route('/',{
	name:"gallery",
	action: (params,queryParams)=>{
		var tags = queryParams["tags"]
		console.log(tags,params,queryParams)
		mount(FrontContainer,{
			content:(tags)=>(<OverGalleryViewContainer tagparse={queryParams} />)
		})
	}
})
postGroups.route('/image/:postId',{
	name:"postingview",
	action: (params,queryParams)=>{
		
		let imgId = FlowRouter.getParam('postId');
		console.log(params,queryParams,imgId);
		mount(FrontContainer,{
			content:()=>(<SingleImageContainer mainimgid={imgId} />)
		})
	}
})
postGroups.route('/upload',{
	name:"postpage",
	action: (params,queryParams)=>{
		mount(FrontContainer,{
			content:()=>(<PostsCreateContainer />)
		})
	}
})
//Remove this after finished!
postGroups.route('/lazyfix',{
	name:'fixdatabase',
	action:(params,queryParams)=>{
		mount(FrontContainer,{
			content:()=>(<FixDataBaseContainer />)
		})
	}
})






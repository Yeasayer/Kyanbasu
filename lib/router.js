import React from 'react';
import {mount} from 'react-mounter';

//Layout Container
import FrontContainer from '../imports/ui/layouts/MainContainer.jsx';

//Front Page Container
import FrontPageContainer from '../imports/ui/components/frontpage.jsx';

//Posting Containers
import PostsCreateContainer from '../imports/ui/components/posts/upload.jsx';

//Now I sorta kinda fucking get it. (Peko image with a self-deprecating knock on head.)
console.log("Seriously!")

//Route groups!
var postGroups = FlowRouter.group({
	prefix:"/posts",
	name:"posts",
})







FlowRouter.route('/posts',{
	name:"postpage",
	action: function(params,queryParams){
		mount(FrontContainer,{
			content:()=>(<PostsCreateContainer />)
		})
	}
})
FlowRouter.route('/',{
	name:"homepage",
	action: function(params,queryParams){
		mount(FrontContainer,{
			content:()=>(<FrontPageContainer />)
		})
	},
})


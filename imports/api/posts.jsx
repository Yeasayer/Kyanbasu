import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Posts = new FS.Collection("imageposts",{
	stores:[
		new FS.Store.FileSystem("imageposts", {path: "~/uploads"})
	]
})
  Posts.allow({
  'insert': function () {
    if(Meteor.user()){
    	return true;
    }
  }
});
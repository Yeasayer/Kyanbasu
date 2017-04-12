import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const Users = new Mongo.Collection('users');

if (Meteor.isServer){
	Meteor.publish('users',function usersPublication(){
		return Users.all()
	})
}
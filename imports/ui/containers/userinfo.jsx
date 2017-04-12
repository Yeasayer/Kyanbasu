import {compose} from 'react-komposer';


import AccountsContainer from '../components/users.jsx';

/*
var login = (e)=>{
	e.preventDefault();
	console.log(e,arguments);
	Meteor.loginWithPassword(user,password,(error)=>{
		if (error){

		}
	});
}
var createAcc = (username,pass1,pass2,email)=>{

}
var logout = ()=>{
	Meteor.logout()
}*/

function composer(props,onData){
	const user = Meteor.user()
	console.log("We just got triggered!")
	onData(null,{user})
}

export default compose(composer)(AccountsContainer);
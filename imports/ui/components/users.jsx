import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';


import Anime from 'react-anime';




class AccountsContainer extends Component {
	constructor(props){
		super(props)

		this.state = {
			hidesuform:true,
			hidesiform:true,
		}
	}
	renderLogged(user,logout){
		console.log(user,"WEDIDIT");
		return(
			<div id="loggedin">
			<p>Hello, {this.props.currentUser.username}</p>
			</div>
		)
	}
	loginUser(e){
		e.preventDefault();
		this.animateSiForms()
		const loginObj = {
			username:ReactDOM.findDOMNode(this.refs.SiUsername).value.trim(),
			password:ReactDOM.findDOMNode(this.refs.SiPassword).value.trim()
		}
		Meteor.loginWithPassword(loginObj.username,loginObj.password,(error)=>{
			if(error){
				console.log(error)
			}else{
				console.log("AWESOME!")
			}
		})
	}
	createAccount(event){

		event.preventDefault();
		this.animateSuForms()
		const createAccObj = {
			username:ReactDOM.findDOMNode(this.refs.SuUsername).value.trim(),
			password:ReactDOM.findDOMNode(this.refs.SuPassword).value.trim(),
			password2:ReactDOM.findDOMNode(this.refs.SuPassword2).value.trim(),
			email:ReactDOM.findDOMNode(this.refs.SuEmail).value.trim()
		}
		console.log(createAccObj);
		Accounts.createUser(createAccObj,(error)=>{
			if (error){
				console.log("NOT SWEET")
				/*swal({
					title:"Whoops!",
					text:error.reason,
					type:'error',
					allowOutsideClick:true,
					confirmButtonText:"Got It!"
				})*/
			} else{
				console.log("SWEET")
				/*swal({
					title:"Awesome!",
					text:"You're now registered as a user"+createAccObj.username+"!",
					type:"success",
					allowOutsideClick:true,
					confirmButtonText:"This is cool!"
				})*/
			}
		})

	}
	//I swear to god that this better magically pay the fuck off. I've gone absolutely nowhere in three days.
	animateSuForms(){
		this.setState({
			hidesuform: !this.state.hidesuform
		})
		if (!this.state.hidesiform){
			this.setState({
				hidesiform: !this.state.hidesiform
			})
		}
	}
	animateSiForms(){
		this.setState({
			hidesiform: !this.state.hidesiform
		})
		if (!this.state.hidesuform){
			this.setState({
				hidesuform: !this.state.hidesuform
			})
		}
	}
	renderCreateAcc(createAcc){
		if (this.state.hidesuform){return ""}
			//Note that this is incrediably silly and make little to no sense.
		else {return (
				<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 200}>
				<form id="signupform" className="headersignform background1 sitefont2" onSubmit={this.createAccount.bind(this)} method="POST" ref="signupform">
					<label htmlFor="username" className="fntsizesmall">What's your name?</label>
					<input type="text" name="username" ref="SuUsername" className="fntsizesmall" placeholder="Come on!"/>
					<label htmlFor="password" className="fntsizesmall">What's your password?</label>
					<input type="password" name="password" ref="SuPassword" className="fntsizesmall" placeholder="What's the code, dood?"/>
					<label htmlFor="password2" className="fntsizesmall">Type that again!</label>
					<input type="password" name="password2" ref="SuPassword2" className="fntsizesmall" placeholder="Who's on first!"/>
					<label htmlFor="email" className="fntsizesmall">What's your e-mail!</label>
					<input type="email" name="email" className="fntsizesmall" ref="SuEmail" placeholder="How can we reach you?"/>
					<input type="submit" name="entrybutton" className="sitefont1 fntsizesmall" value="Come On In!"/>
				</form>
				</Anime>
		)}
	}
	renderLogin(){
		if (this.state.hidesiform){return ""}
		else{
			console.log("WE SHOULD RENDER NOW!");
			return(
				<Anime opacity={[0, 1]} translateY={'1em'} delay={(e, i) => i * 200}>
				<form id="signinform" className="headersignform background1 sitefont2" onSubmit={this.loginUser.bind(this)} method="POST" ref="signinform">
					<label htmlFor="username" className="fntsizesmall">What's your name?</label>
					<input type="text" className="fntsizesmall" ref="SiUsername" name="username" placeholder="Come on!"/>
					<label htmlFor="password" className="fntsizesmall">What's your password?</label>
					<input type="password" className="fntsizesmall" name="password" ref="SiPassword" placeholder="What's the code, dood?"/>
					<input type="submit" name="entrybutton" className="fntsizesmall sitefont1" value="Come On In!"/>
				</form>
				</Anime>
		)}
	}
	render(){
		console.log(this.props.currentUser,"WAHOO!",this.state);
		return(
			<div className="loginmodal">
				{this.props.currentUser?this.renderLogged(this.props.currentUser):<div><button id="signinbutton" className="signbutton sitefont1 fntcolor1" ref="signinbutton" data-clicked={this.state.hidesiform} onClick={this.animateSiForms.bind(this)}><p>Sign In</p></button>{this.renderLogin()}</div>}
				{this.props.currentUser?"":<div><button id="signupbutton" className="signbutton sitefont1 fntcolor1" ref="signupbutton" data-clicked={this.state.hidesuform} onClick={this.animateSuForms.bind(this)}><p>Sign Up</p></button>{this.renderCreateAcc()}</div>}
			</div>
		)
	}
}

export default createContainer(()=>{
	return{
		currentUser:Meteor.user(),
	}
},AccountsContainer);

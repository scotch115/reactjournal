import React, { Component } from 'react';
import firebase from 'firebase';
import { DB_CONFIG } from './Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import App from './App';

class Login extends Component {
    constructor(props) {
        super(props);
        this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
		// this.database = this.app.database().ref().child('entries/');
		this.database = this.app.database().ref('entries/');

		this.state = {
			isSignedIn: false
        }
        
		const uiConfig = {
			signInFlow: 'popup',
			signInOptions: [
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.GithubAuthProvider.PROVIDER_ID,
				firebase.auth.TwitterAuthProvider.PROVIDER_ID
			],
			callbacks: {
				signInSuccessfulWithAuthResult: () => false
			}
        };
        

        this.state = {
            entries: [],
            isSignedIn: false,
            uiConfig: uiConfig
		}
		
	}
	
	componentDidMount() {
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
	}

	componentWillUnmount() {
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
	}
    
    render() { 
        if (!this.state.isSignedIn) {
			return(
				<div className="container box">
					<div className=" title is-4 has-text-centered">React Journal</div>
					<p className="has-text-centered">Please sign in:</p>
					<StyledFirebaseAuth uiConfig={this.state.uiConfig} firebaseAuth={firebase.auth()} />
					</div>
			)
        } else {
			console.log('Signed in and returning to App');
            return(
				<App />
			)
        };
    }
}
 
export default Login;
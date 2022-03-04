import React, { Component } from 'react';
import firebase from 'firebase';
import { DB_CONFIG } from '../Models/Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import App from './App';
import Particles from 'react-tsparticles';

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
			(user) => this.setState({ isSignedIn: !!user })
		);
	}

	componentWillUnmount() {
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({ isSignedIn: !!user })
		);
	}

	particlesInit(main) {
		console.log(main);
	};

	particlesLoaded(container) {
		console.log(container);
	};

	render() {
		if (!this.state.isSignedIn) {
			return (
				<>
					<Particles
						id="tsparticles"
						init={this.particlesInit()}
						loaded={this.particlesLoaded()}
						options={{
							background: {
								color: {
									value: "#FFFFF",
								},
							},
							fpsLimit: 120,
							interactivity: {
								events: {
									onClick: {
										enable: true,
										mode: "push",
									},
									onHover: {
										enable: true,
										mode: "repulse",
									},
									resize: true,
								},
								modes: {
									bubble: {
										distance: 400,
										duration: 2,
										opacity: 0.8,
										size: 40,
									},
									push: {
										quantity: 4,
									},
									repulse: {
										distance: 200,
										duration: 0.4,
									},
								},
							},
							particles: {
								color: {
									value: "#aaaaaa",
								},
								links: {
									color: "#aaaaaa",
									distance: 150,
									enable: true,
									opacity: 1,
									width: 1,
								},
								collisions: {
									enable: true,
								},
								move: {
									direction: "none",
									enable: true,
									outMode: "bounce",
									random: false,
									speed: 2,
									straight: false,
								},
								number: {
									density: {
										enable: true,
										area: 800,
									},
									value: 80,
								},
								opacity: {
									value: 1,
								},
								shape: {
									type: "circle",
								},
								size: {
									random: true,
									value: 5,
								},
							},
							detectRetina: true,
						}}
					/>
					<div
						className="box"
						style={{ position: 'relative', top: (window.screen.width) ? '20vh' : '10vh', width: (window.screen.width <= 415) ? '300px' : '400px', display: 'flexbox', justifyContent: 'center', margin: 'auto' }}
					>
						<p style={{ fontSize: (window.screen.width <= 415) ? '5vh' : '8vh', fontWeight: 'bold', textAlign: 'end', display: 'inline-flex', width: '100%', justifyContent: 'end', paddingRight: '10%' }}>Hello<br /> There.</p>
						<StyledFirebaseAuth uiConfig={this.state.uiConfig} firebaseAuth={firebase.auth()} />
					</div>
				</>
			)
		} else {
			console.log('Signed in and returning to App');
			return (
				<App />
			)
		};
	}
}

export default Login;
import React, { Component } from 'react';
import Hello from '../Models/Hello';
import Today from '../Models/Date';
import firebase from 'firebase';
import ReactRoundedImage from 'react-rounded-image';
import New from './New';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { profilePicture } from '../data/constants';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';


class App extends Component {
	constructor() {
		super();
		var date = new Date();
		var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

		this.state = {
			name: 'Friend',
			date: today,
			entries: [],
			isSignedIn: false,
			dialog: false,
			warning: false,
			deletedItem: '',
			loading: false,
		};
		this.onClick = this.onClick.bind(this);
		this.onHide = this.onHide.bind(this);
		this.accept = this.accept.bind(this);
		this.reject = this.reject.bind(this);
	}

	componentDidMount() {
		var itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}`);
		itemsRef.on('value', (snapshot) => {
			let entries = snapshot.val();
			let newState = [];
			for (let entry in entries) {
				newState.push({
					id: entry,
					title: entries[entry].title,
					articleBody: entries[entry].articleBody
				});
			}
			this.setState({
				entries: newState
			});
		});
	}


	signOutCurrentUser(e) {
		firebase.auth().signOut().then(function () {
			console.log('User signed out');
		}, function (error) {
			console.error('Error signing out', error);
		});
	}

	removeItem(itemId) {
		// var userId = firebase.auth().currentUser.displayName;
		const itemRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}/${itemId}`);
		itemRef.remove();
	}

	onClick(name, position) {
		let state = {
			[`${name}`]: true
		};

		if (position) {
			state = {
				...state,
				position
			}
		}

		this.setState(state);
	}

	onHide(name) {
		this.setState({
			[`${name}`]: false
		});
	}

	accept() {
		this.toast.show({ severity: 'success', summary: 'Success', detail: 'Journal entry deleted successfully', life: 3000 });
	}

	reject() {
		this.toast.show({ severity: 'info', summary: 'Cancelled', detail: 'Journal entry was not deleted', life: 3000 });
	}

	

	render() {
		// If user is logged in, create local variables 
		var userName = firebase.auth().currentUser.displayName;
		var user = firebase.auth().currentUser;
		this.profilePicture = user.photoURL;

		return (
			<div style={{ backgroundColor: "white", height: "100vh", padding: '10px' }}>
				<div style={{ padding: '2px' }}>
					<div className="title" style={{ fontSize: '3vh' }}>
						<Hello name={userName} />
					</div>
					<div className="subtitle" style={{ fontSize: '2vh' }}>
						<Today date={this.state.date} />
					</div>
					<div style={{ position: 'absolute', right: '5vmin', top: '2vmin', cursor: 'pointer' }} onClick={() => window.open('/settings', '_self')}>
						<ReactRoundedImage image={this.profilePicture} imageWidth="80" imageHeight="80" roundedSize='5' />
					</div>
					<Button
						className='p-button-rounded'
						icon='pi pi-pencil'
						style={{
							position: 'fixed',
							bottom: '5%',
							right: '8%',
							zIndex: 1,
							width: '50px',
							height: '50px',
						}}
						onClick={() => {
							this.onClick('dialog');
						}}
					/>
				</div>
				<div className="container" style={{ backgroundColor: "white", paddingTop: '20px' }}>
					<div className="tile is-ancestor">
						<div className="tile is-vertical is-parent" id="tileContainer">
							{this.state.entries.map((entry, index) => {
								return (
									<div className="tile box is-child is-white">
										<Button
											className="p-button-rounded p-button-text p-button-plain"
											icon="pi pi-minus-circle"
											onClick={() => this.setState({ warning: true, deletedItem: entry.id })}
											style={{
												position: 'absolute',
												right: '40px'
											}}
										/>
										<div
											style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
										>
											<Button
												icon='pi'
												className="p-button-rounded"
											>
												{(index + 1)}
											</Button>
											<span style={{ width: '10px' }} />
											<p className="title is-5">{entry.title}</p>
										</div>
										<div className="has-text-centered" style={{ padding: "10px" }}></div>
										{entry.articleBody}
									</div>
								)
							})}
						</div>
					</div>
				</div>
				{/* <Button 
				label="Sign Out"
				className="p-button-rounded"
				onClick={this.signOutCurrentUser}
			/> */}
				<br /><br />
				<footer className="hero-foot">
					<div className="content has-text-centered" style={{ cursor: 'pointer' }} onClick={() => window.open('https://jordangamache.io', '_self')}>
						Made with <i className="fa fa-heart" style={{ color: "rgb(235, 43, 86)" }}></i> & <i className="fa fa-coffee" style={{ color: "rgb(44, 31, 22)" }}></i> in Orlando
					</div>
				</footer>
				<Dialog
					visible={this.state.dialog}
					style={{ width: '80vw' }}
					onHide={() => this.onHide('dialog')}
					maximizable
				>
					<New handleClose={this.onHide} />
				</Dialog>
				<ConfirmDialog
					visible={this.state.warning}
					style={{ width: '330px' }}
					onHide={() => this.onHide('warning')}
					icon="pi pi-exclamation-triangle"
					message="Are you sure you want to delete this entry?"
					footer={
						<>
							<Button
								label="Yes"
								className='p-button-danger p-button-rounded'
								loading={this.state.loading}
								onClick={() => {
									this.setState({ loading: true });
									setTimeout(() => {
										this.removeItem(this.state.deletedItem);
										this.setState({ deletedItem: '', loading: false });
										this.onHide('warning');
										this.accept()
									}, 1500);
								}}
							/>
							<Button 
								label="No"
								className='p-button-info p-button-rounded'
								onClick={() => {
									this.setState({ deletedItem: '' });
									this.onHide('warning');
									this.reject();
								}}
							/>
						</>
					}
				>
				</ConfirmDialog>
				<Toast ref={(el) => this.toast = el} position="top-right"/>
			</div>
		);
	}
}

export default App;

import React, { Component } from 'react';
import Hello from './Hello';
import Today from './Date';
import firebase from 'firebase';
import ReactRoundedImage from 'react-rounded-image';


class App extends Component {
  constructor() {
    super();
    var date = new Date();
    var today = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();

    this.state = {
      name: 'Friend',
      date: today,
      entries: [],
      isSignedIn: false,
    };
  }

	componentDidMount() {
          // TODO: Add user-specific database folders based on login
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
		firebase.auth().signOut().then(function() {
			console.log('User signed out');
		}, function(error) {
			console.error('Error signing out', error);
		});
	}

	removeItem(itemId) {
		// var userId = firebase.auth().currentUser.displayName;
		const itemRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}/${itemId}`);
		itemRef.remove();
	}



  render() {
    // If user is logged in, create local variables 
    var userName = firebase.auth().currentUser.displayName;
    var user = firebase.auth().currentUser;

    return (
      <div style={{ backgroundColor: "white", height: "100vh", padding: '10px'}}>
        <div style={{padding: '2px'}}>
            <div className="title" style={{fontSize: '3vh'}}>
            <Hello name={userName} />
            </div>
            <div className="subtitle" style={{fontSize: '2vh'}}>
            <Today date={this.state.date} />
            </div>
			<div style={{position: 'absolute', right: '5vmin', top: '2vmin'}}><ReactRoundedImage image={user.photoURL} roundedSize="0" imageWidth="80" imageHeight="80" roundedSize='5'/></div>
            <div className="button" type="submit" style={{marginBottom: '10px'}}><a href="/new-entry" style={{textDecoration: 'none', color: 'black'}}>New entry</a></div>
        </div>
         <div className="container box" style={{backgroundColor: "white"}}>
         <p className="title is-4">Past Entries</p>
          <div className="tile is-ancestor">
            <div className="tile is-vertical is-parent" id="tileContainer">
						{this.state.entries.map((entry) => {
							return (
								<div className="tile box is-child notification is-white">
								<button className="delete" onClick={() => this.removeItem(entry.id)}></button>
									<p className="title is-5">{entry.title}</p>
									<div className="has-text-centered" style={{padding: "10px"}}></div>
									{entry.articleBody}
								</div>
							)
						})}
						</div>
          </div>
         </div>
			<button className="button is-rounded" onClick={this.signOutCurrentUser}>Sign Out</button>
			<br /><br />
			<div style={{width: "20vw", position: 'relative', left: '40%'}}>
						<a href="https://apps.apple.com/us/app/quill-journal/id1552008916?itsct=apps_box&amp;itscg=30200" style={{display: "inlineBlock", overflow: "hidden", borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRightRadius: '13px', width: "250px", height: "83px"}} >
							<img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/white/en-US?size=250x83&amp;releaseDate=1612569600&h=b1704f64bbcc8e35d2f6e07d3d35cada" alt="Download on the App Store" style={{borderTopLeftRadius: "13px", borderTopRightRadius: '13px', borderBottomRightRadius: '13px', borderBottomRadius: '13px', width: "250px", height: "83px"}} />
						</a>
					</div>
			<footer className="hero-foot">
				<div className="content has-text-centered">
					Made with <i className="fa fa-heart" style={{color: "rgb(235, 43, 86)"}}></i> & <i className="fa fa-coffee" style={{color: "rgb(44, 31, 22)"}}></i> in Orlando
					<div className=" content has-text-centered">
						<a href="https://bulma.io">
							<img src="https://bulma.io/images/made-with-bulma--black.png" alt="Made with Bulma" width="128" height="24" />
						</a>
					</div>
				</div>
			</footer>
       </div>
    );
  }
}

export default App;

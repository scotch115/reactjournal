import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Today from './Date';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import firebase from 'firebase';
import { DB_CONFIG } from './Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


class App extends Component {
  constructor() {
    super();
		this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
		// this.database = this.app.database().ref().child('entries/');
		this.database = this.app.database().ref(`entries/${firebase.auth().currentUser.displayName}`);

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


    var date = new Date();
    var today = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
		var title = (date.getMonth()+1)+'/'+date.getDate();

    this.state = {
      name: 'Friend',
      date: today,
      text: '',
      theme: 'snow',
			title: title,
			entries: [],
			isSignedIn: false,
			uiConfig: uiConfig
    };
    this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (value) {
    this.setState({
			text: value
		});
  }

  handleThemeChange (newTheme) {
    if (newTheme === "core") {
      newTheme = null;
      this.setState({ theme: newTheme });
    }
  }

	componentDidMount() {
		  var dbRef = firebase.database().ref('entries/');
		  // TODO: Add user-specific database folders based on login
		  // firebase.auth().onAuthStateChanged(function(user){
		  //	if (user) {
		  //	itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.displayName}`);
		  // }
		  //	else {
		  //	itemsRef = firebase.database().ref('entries/');
		  // }
		  //});
		  var itemsRef = dbRef.child(`${firebase.auth().currentUser.displayName}`);
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
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
	}

	componentWillUnmount() {
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
	}

	handleSubmit(e) {
		e.preventDefault();
		const itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.displayName}`);
		var editedTxt = this.state.text.slice(3, this.state.text.length - 4);
		const entry = {
			title: this.state.title,
			articleBody: editedTxt
		}
		itemsRef.push(entry);
		this.setState({
			title: '',
			articleBody: '',
			text: ''
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
		const itemRef = firebase.database().ref(`entries/${firebase.auth().currentUser.displayName}/`);
		itemRef.remove();
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
		};
    return (
      <div className="container" style={{ backgroundColor: "white", height: "100vh", padding: "10px"}}>
        <div className="title">
          <Hello name={firebase.auth().currentUser.displayName} />
        </div>
        <div className="subtitle">
          <Today date={this.state.date} />
        </div>
        <div>
          <p>Begin your day here:</p>
          <ReactQuill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.text}
            modules={App.modules}
            formats={App.formats}
            bounds={'.app'}
            placeholder={this.props.placeholder}
          />
         <br />
         <button className="button" type="submit" onClick={this.handleSubmit}>Save entry</button>
         </div>
         <br />
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

App.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
App.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

/*
 * PropType validation
 */
App.propTypes = {
  placeholder: PropTypes.string,
}

render(<App placeholder="Start here!"/>, document.getElementById('root'));

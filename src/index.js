import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Today from './Date';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import firebase from 'firebase';
import { DB_CONFIG } from './Config';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ls from 'local-storage';


class App extends Component {
  constructor(props) {
    super(props);
		this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
		this.database = this.app.database().ref().child('entries/');
		// this.database = this.app.database().ref('entries/');

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
			uiConfig: uiConfig,
			background: ls.get('background') || 'white',
			containerBackground: ls.get('containerBackground') || 'white',
			entriesBackground: ls.get('entriesBackground') || 'white',
			textColor: ls.get('textColor') || 'black',
			bulmaImage: ls.get('bulmaImage') || "https://bulma.io/images/made-with-bulma--black.png"
    };
    this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.removeTags = this.removeTags.bind(this);
		this.changeTheme = this.changeTheme.bind(this);
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
			var itemsRef = firebase.database().ref('entries/');
			firebase.auth().onAuthStateChanged(function(user) {
					console.log("Current user logged in is "+user.displayName);
					if (user) {
						itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}/`)
						console.log("Inside if statement: "+itemsRef);
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
					} else {
						itemsRef = firebase.database().ref('entries/')
						console.log("Inside else statement: "+itemsRef);
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
				}.bind(this));
				console.log("itemsRef once conditional statement has been executed "+itemsRef);

		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
		fetch(URL)
		.then(response => response.json())
		.then(json => this.setState({
			background: ls.get('background'),
			containerBackground: ls.get('containerBackground'),
			entriesBackground: ls.get('entriesBackground'),
			textColor: ls.get('textColor'),
			bulmaImage: ls.get('bulmaImage')
		}));
	}

	componentWillUnmount() {
		this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
			(user) => this.setState({isSignedIn: !!user})
		);
	}

	removeTags(str) {
      if ((str===null) || (str===''))
			{
      	return false;
      } else {
      str = str.toString();
      return str.replace( /(<([^>]+)>)/ig, '\n');
		}
   }

	handleSubmit(e) {
		e.preventDefault();
		// var userId = firebase.auth().currentUser.displayName;
		const itemsRef = firebase.database().ref(`entries/${this.app.auth().currentUser.uid}`);
		// var editedTxt = this.state.text.slice(3, this.state.text.length - 4);
		var editedTxt = this.removeTags(this.state.text);
		const entry = {
			title: this.state.title,
			articleBody: editedTxt
		}
		itemsRef.push(entry);
		this.setState({
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
		// var userId = firebase.auth().currentUser.displayName;
		const itemRef = firebase.database().ref(`entries/${this.app.auth().currentUser.uid}/${itemId}`);
		itemRef.remove();
	}

	changeTheme = () => {
		if (this.state.background === 'white') {
			this.setState({
				background: "#303a52",
				textColor: 'white',
				containerBackground: "#574b90",
				entriesBackground: "#9e579d",
				bulmaImage: "https://bulma.io/images/made-with-bulma--white.png"
			})
			ls.set('background', "#303a52");
			ls.set('textColor', 'white');
			ls.set('containerBackground', "#574b90");
			ls.set('entriesBackground', "#9e579d");
			ls.set('bulmaImage', "https://bulma.io/images/made-with-bulma--white.png");
		} else if (this.state.background === '#303a52') {
			this.setState({
				background: "#6e3b3b",
				textColor: 'white',
				containerBackground: "#ac3f21",
				entriesBackground: "#be6a15",
				bulmaImage: "https://bulma.io/images/made-with-bulma--white.png"
			})
			ls.set('background', "#6e3b3b");
			ls.set('textColor', 'white');
			ls.set('containerBackground', "#ac3f21");
			ls.set('entriesBackground', "#be6a15");
			ls.set('bulmaImage', "https://bulma.io/images/made-with-bulma--white.png");
		} else if (this.state.background === '#6e3b3b') {
			this.setState({
				background: '#071e3d',
				textColor: 'white',
				containerBackground: '#1f4287',
				entriesBackground: '#278ea5',
				bulmaImage: "https://bulma.io/images/made-with-bulma--white.png"
			})
			ls.set('background', "#071e3d");
			ls.set('textColor', 'white');
			ls.set('containerBackground', "#1f4287");
			ls.set('entriesBackground', "#278ea5");
			ls.set('bulmaImage', "https://bulma.io/images/made-with-bulma--white.png");
		} else if (this.state.background === '#071e3d')
		{
			this.setState({
				background: 'white',
				textColor: 'black',
				containerBackground: 'white',
				entriesBackground: 'white',
				bulmaImage: "https://bulma.io/images/made-with-bulma--black.png"
			})
			ls.set('background', 'white');
			ls.set('textColor', 'black');
			ls.set('containerBackground', 'white');
			ls.set('entriesBackground', 'white');
			ls.set('bulmaImage', "https://bulma.io/images/made-with-bulma--black.png");
		}
	}

  render() {
		if (typeof document != 'undefined'){
			console.log("User is using web browser!");
		} else if (typeof navigator != 'undefined' && navigator.product === 'ReactNative') {
			console.log("User is using ReactNative!");
		} else {
			console.log("I'm in NodeJS??");
		}
		if (!this.state.isSignedIn) {
			return(
				<div className="container box" style={{position: "relative", top: "20vh"}}>
					<div className=" title is-4 has-text-centered">React Journal</div>
					<p className="has-text-centered">Please sign in:</p>
					<StyledFirebaseAuth uiConfig={this.state.uiConfig} firebaseAuth={firebase.auth()} />
					</div>
			)
		}
    return (
      <div style={{ backgroundColor: this.state.background, color: this.state.textColor, height: "100%", width: "100vw", padding: "10px"}}>
        <div className="title" style={{color: this.state.textColor}}>
          <Hello name={firebase.auth().currentUser.displayName} />
        </div>
        <div className="subtitle" style={{color: this.state.textColor}}>
          <Today date={this.state.date} />
        </div>
        <div style={{color: 'black'}}>
          <p style={{color: this.state.textColor}}>Begin your day here:</p>
          <ReactQuill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.text}
            modules={App.modules}
            formats={App.formats}
            bounds={'.app'}
            placeholder={this.props.placeholder}
						style={{backgroundColor: 'white'}}
          />
         <br />
         <button className="button" type="submit" onClick={this.handleSubmit}>Save entry</button>
				 <button className="button is-info" style={{marginLeft: 10}} type="submit" onClick={this.changeTheme}>Change Theme</button>
         </div>
         <br />
         <div className="container box" style={{backgroundColor: this.state.containerBackground, color: this.state.textColor}}>
         <p className="title is-4" style={{color: this.state.textColor}}>Past Entries</p>
          <div className="tile is-ancestor">
            <div className="tile is-vertical is-parent" id="tileContainer">
						{this.state.entries.map((entry) => {
							return (
								<div className="tile box is-child notification" style={{whiteSpace: "pre-line", backgroundColor: this.state.entriesBackground, color: this.state.textColor}}>
								<button className="delete" onClick={() => this.removeItem(entry.id)}></button>
									<p className="title is-5">{entry.title}</p>
									<div className="has-text-centered"></div>
									{entry.articleBody}
								</div>
							)
						})}
						</div>
          </div>
         </div>
				 <button className="button is-rounded" onClick={this.signOutCurrentUser}>Sign Out</button>
				 <br /><br />
				 <footer className="hero-foot" style={{backgroundColor: this.state.background}}>
			    <div className="content has-text-centered">
			     Made with <i className="fa fa-heart" style={{color: "rgb(235, 43, 86)"}}></i> & <i className="fa fa-coffee" style={{color: "rgb(44, 31, 22)"}}></i> in Orlando
			    <div className=" content has-text-centered">
			      <a href="https://bulma.io">
			      <img src={this.state.bulmaImage} alt="Made with Bulma" width="128" height="24" />
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
  placeholder: PropTypes.string
}

render(<App placeholder="Start here!"/>, document.getElementById('root'));

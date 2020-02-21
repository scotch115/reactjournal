import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Today from './Date';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import firebase from 'firebase';
import { DB_CONFIG } from './Config';

class App extends Component {
  constructor() {
    super();
		this.app = firebase.initializeApp(DB_CONFIG);
		this.database = this.app.database().ref().child('entries');


    var date = new Date();
    var today = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
		var title = (date.getMonth()+1)+'/'+date.getDate();

    this.state = {
      name: 'Friend',
      date: today,
      text: '',
      theme: 'snow',
			title: title,
			entries: []
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
		const itemsRef = firebase.database().ref('entries');
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

	handleSubmit(e) {
		e.preventDefault();
		const itemsRef = firebase.database().ref('entries');
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

	removeItem(itemId) {
		const itemRef = firebase.database().ref(`/entries/${itemId}`);
		itemRef.remove();
	}



  render() {
    return (
      <div className="container" style={{ backgroundColor: "white", height: "100vh" }}>
        <div className="title">
          <Hello name={this.state.name} />
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

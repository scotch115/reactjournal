import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import Today from './Date';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import './style.css';
import firebase from 'firebase';
import { DB_CONFIG } from './config.js';

class App extends Component {
  constructor(props) {
    super(props);
		this.app = firebase.initializeApp(DB_CONFIG);
		this.database = this.app.database().ref().child('entries');

    var date = new Date();
    var today = (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
    this.state = {
      name: 'Jordan',
      date: today,
      editorHtml: '',
      theme: 'snow',
			speed: 10
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (html) {
    this.setState({ editorHtml: html });
  }

  handleThemeChange (neTheme) {
    if (newTheme === "core") {
      newTheme = null;
      this.setState({ theme: newTheme });
    }
  }

	componentDidMount() {
		this.database.on('value', snap({
			var journal = this.database.val();
			var keys = this.database.Object.keys(journal);

			for (var i = 0; i < keys.length; i++) {
				var k = keys[i];
				var title = journal[k].title;
				var articleBody = journal[k].articleBody;
				var article = document.createElement("div");
				article.innerHTML += '<article className="tile is-child box">';
				article.innerHTML += '<p className="title is-5">'+title+'</p>';
				article.innerHTML += articleBody;
				article.innerHTML += '</article>';
				document.getElementById('tileContainer').appendChild(article);
		});
	}

  render() {
    return (
      <div className="container box" style={{ backgroundColor: "white", height: "100vh" }}>
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
            value={this.state.editorHtml}
            modules={App.modules}
            formats={App.formats}
            bounds={'.app'}
            placeholder={this.props.placeholder}
          />
         <br />
         <button className="button" onclick="save">Save entry</button>
         </div>
         <br />
         <div className="container box" style={{backgroundColor: "white"}}>
         <p className="title is-4">Past Entries</p>
          <div className="tile is-ancestor">
            <div className="tile is-vertical is-parent" id="tileContainer">
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

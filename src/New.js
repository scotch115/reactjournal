import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import firebase from 'firebase';
import {DB_CONFIG} from './Config';

class New extends Component {
    constructor(props) {
        super(props);

        this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
		// this.database = this.app.database().ref().child('entries/');
		this.database = this.app.database().ref('entries/');


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
          };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange (value) {
        this.setState({
                text: value
            });
      }

      handleSubmit(e) {
		e.preventDefault();
		// var userId = firebase.auth().currentUser.displayName;
		const itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}`);
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
        this.props.history.push('/');
	}

    render() { 
        return ( 
        <div className="container" style={{ backgroundColor: "white", height: "100vh", padding: "10px"}}>
            <div>
            <div style={{fontSize: '3vh'}}>New Entry: {this.state.title}</div>
            <ReactQuill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.text}
            modules={New.modules}
            formats={New.formats}
            bounds={'.New'}
            placeholder={this.props.placeholder}
            />
            <br />
            <button className="button" type="submit" onClick={this.handleSubmit}>Save entry</button>
        </div>
        </div>
         );
    }
}

New.modules = {
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
  New.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
  
  /*
   * PropType validation
   */
  New.propTypes = {
    placeholder: PropTypes.string,
  }
 
export default New;
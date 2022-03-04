import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import firebase from 'firebase';
import { DB_CONFIG } from '../Models/Config';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

class New extends Component {
  constructor(props) {
    super(props);

    this.app = !firebase.apps.length ? firebase.initializeApp(DB_CONFIG) : firebase.app();
    // this.database = this.app.database().ref().child('entries/');
    this.database = this.app.database().ref('entries/');


    var date = new Date();
    var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    var title = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear().toString().split('')[2] + date.getFullYear().toString().split('')[3];

    this.state = {
      name: 'Friend',
      date: today,
      text: '',
      theme: 'snow',
      title: title,
      value: '', 
      entries: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(value) {
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
      title: (this.state.value !== '') ? this.state.value : this.state.title,
      articleBody: editedTxt
    }
    itemsRef.push(entry);
    this.setState({
      title: '',
      articleBody: '',
      text: '',
      value: '',
    });
    this.props.handleClose('dialog');
  }

  render() {
    return (
      <div className="container" style={{ backgroundColor: "white", height: "100vh", padding: "10px" }}>
        <div>
          <div style={{ fontSize: '3vh' }}>
            New Entry:
            <InputText
              value={this.state.value}
              placeholder={`${this.state.title}`}
              onChange={(e) => { this.setState({ value: e.target.value })}}
              style={{ marginLeft: '10px', width: '20vw'}}
              className="p-inputtext-lg p-d-block"
            />
          </div>
          <br />
          <ReactQuill
            theme={this.state.theme}
            onChange={this.handleChange}
            value={this.state.text}
            modules={New.modules}
            formats={New.formats}
            bounds={'.New'}
            placeholder={this.props.placeholder}
            style={{ height: '200px'}}
          />
          <br />
          <div style={{ position: 'absolute', bottom: '20%', display: 'flex', width: '100%', justifyContent: 'center'  }}>
            <Button
              className="p-button-rounded"
              type="submit"
              style={{ }}
              onClick={this.handleSubmit}
            >
              Save entry
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

New.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
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
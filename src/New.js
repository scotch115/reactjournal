class New extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
        <div>
            <p>New Entry:</p>
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
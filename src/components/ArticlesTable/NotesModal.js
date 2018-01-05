/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-magic-numbers */
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ReactMarkdown from 'react-markdown';
import Textarea from 'react-textarea-autosize';

import { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from './../Fields/FlatButton';
import { createNote, updateNote, deleteNote } from './../../actions/notes';


const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px',
  },
  submit: {
    float: 'left',
    margin: '0 10px',
  },
  close: {
    margin: '0 10px',
  },
  doneIconStyle: {
    color: '#2196F3',
  },
  dialogBody: {
    padding: '3px',
    backgroundColor: '#eee',
    minHeight: '300px',
    maxHeight: '500px',
  },
  textArea: {
    boxSizing: 'border-box',
    width: '100%',
    backgroundColor: '#eee',
  },
};

const dummyNote = { text: '', id: '-1' };

class NotesModal extends Component {
  static propTypes = {
    articleId: PropTypes.number,
    createNote: PropTypes.func,
    deleteNote: PropTypes.func,
    handleClose: PropTypes.func,
    notes: PropTypes.array,
    updateArticle: PropTypes.func,
    updateNote: PropTypes.func,
  }

  constructor(props) {
    super(props);

    // component supports only one note.
    const note = props.notes[0] || dummyNote;

    this.state = {
      editing: note.text === '',
      note,
    };
    this.textArea = null;

    [
      'handleMarkdownClick',
      'handleDoneClick',
      'handleClose',
      'handleOk',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  componentWillMount() {
    this.focusTextArea();
  }

  focusTextArea() {
    setTimeout(() => this.textArea && this.textArea.focus(), 500);
  }

  handleMarkdownClick() {
    this.focusTextArea();
    this.setState({ editing: true });
  }

  handleDoneClick() {
    this.setState({ editing: false });
  }

  handleClose() {
    this.props.handleClose();
  }

  handleOk() {
    if ((this.props.notes[0] || dummyNote).text === this.state.note.text) {
      this.props.handleClose();

      return;
    }

    const payload = { text: this.state.note.text };

    if (dummyNote.id === this.state.note.id) {
      this.props.createNote(this.props.articleId, payload);
    } else if (this.state.note.text === '') {
      this.props.deleteNote(this.state.note.id, payload);
    } else {
      this.props.updateNote(this.state.note.id, payload);
    }

    // HACK to update article in the table
    this.props.updateArticle(this.props.articleId, {});

    this.props.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label={'Ok'}
        primary
        style={inlineStyles.submit}
        onTouchTap={this.handleOk}
      />,
      <FlatButton
        label={'Cancel'}
        primary
        style={inlineStyles.close}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          autoDetectWindowHeight
          bodyStyle={inlineStyles.dialogBody}
          open
          title={'Notes'}
          titleStyle={inlineStyles.titleStyle}
        >
          {
            this.state.editing === true
            ? <div>
              <Textarea
                inputRef={(el) => { this.textArea = el; }}
                style={inlineStyles.textArea}
                value={this.state.note.text}
                onChange={(e) => this.setState({
                  note: {
                    id: this.state.note.id,
                    text: e.target.value,
                  },
                })}
              />
              <IconButton
                iconStyle={inlineStyles.doneIconStyle}
                onTouchTap={this.handleDoneClick}
              >
                <DoneIcon />
              </IconButton>
            </div>
            : <div
              style={{ minHeight: '200px' }}
              onTouchTap={this.handleMarkdownClick}
            >
              <ReactMarkdown
                source={this.state.note.text}
              />
            </div>
          }
        </Dialog>
      </div>
    );
  }
}

export default connect(null, {
  createNote,
  updateNote,
  deleteNote,
})(NotesModal);

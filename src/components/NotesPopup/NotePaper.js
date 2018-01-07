/* eslint-disable react/jsx-no-bind */
import { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';

import Paper from 'material-ui-next/Paper';
import TextField from 'material-ui-next/TextField';
import IconButton from 'material-ui-next/IconButton';

import CloseIcon from 'material-ui-icons/Close';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import DoneIcon from 'material-ui-icons/Done';
import ModeEditIcon from 'material-ui-icons/ModeEdit';

import { CodeBlock } from '../CodeBlock/CodeBlock';


const inlineStyles = {
  notePaper: {
    margin: '5px',
    padding: '10px',
  },
  paperContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

class NotePaper extends Component {
  static propTypes = {
    note: PropTypes.object,
    onDeleteNote: PropTypes.func,
    onUpdateNote: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentText: '',
      editing: false,
    };

    [
      'handleEditCanceled',
      'handleEditNoteClicked',
      'handleUpdateNote',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  handleEditCanceled() {
    this.setState({
      editing: false,
    });
  }

  handleEditNoteClicked() {
    this.setState({
      editing: true,
      currentText: this.props.note.text,
    });
  }

  handleUpdateNote() {
    this.props.onUpdateNote({ text: this.state.currentText });

    this.setState({ editing: false });
  }

  render() {
    return <Paper style={inlineStyles.notePaper}>
      {
        this.state.editing === true
        ? <div style={inlineStyles.paperContent}>
          <TextField
            autoFocus
            multiline
            name="newnote"
            style={{ flex: 1, overflow: 'hidden' }}
            value={this.state.currentText}
            onChange={(e) => this.setState({ currentText: e.target.value })}
          />
          <div>
            <IconButton
              onTouchTap={this.handleUpdateNote}
            >
              <DoneIcon />
            </IconButton>
            <IconButton
              onTouchTap={this.handleEditCanceled}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        : <div style={inlineStyles.paperContent}>
          <div style={{ overflow: 'hidden' }}>
            <ReactMarkdown
              renderers={{ code: CodeBlock }}
              source={this.props.note.text}
            />
          </div>
          <div>
            <IconButton
              onTouchTap={this.handleEditNoteClicked}
            >
              <ModeEditIcon />
            </IconButton>
            <IconButton
              onTouchTap={this.props.onDeleteNote}
            >
              <DeleteForeverIcon />
            </IconButton>
          </div>
        </div>
      }
    </Paper>;
  }
}

export default NotePaper;

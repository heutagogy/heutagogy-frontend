/* eslint-disable react/jsx-no-bind */
import { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';

import { CodeBlock } from './CodeBlock';


const inlineStyles = {
  notePaper: {
    margin: '5px',
    padding: '10px',
    opacity: '0.7',
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
            multiLine
            name="newnote"
            style={{ flex: 1, overflow: 'hidden' }}
            value={this.state.currentText}
            onChange={(e, t) => this.setState({ currentText: t })}
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

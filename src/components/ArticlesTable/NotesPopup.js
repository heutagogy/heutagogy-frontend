/* eslint-disable react/jsx-no-bind */
import { connect } from 'react-redux';

import ReactMarkdown from 'react-markdown';

import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from './../Fields/RaisedButton';
import { createNote, updateNote, deleteNote } from './../../actions/notes';


const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px',
  },
  paperStyle: {
    margin: '5px',
    padding: '10px',
  },
  notePaper: {
    margin: '5px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

class NotesPopup extends Component {
  static propTypes = {
    articleId: PropTypes.number,
    createNote: PropTypes.func,
    deleteNote: PropTypes.func,
    handleClose: PropTypes.func,
    notes: PropTypes.array,
    // updateNote: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentNote: '',
    };

    [
      'handleAddNoteClicked',
      'handleDeleteNote',
      'renderNote',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  handleAddNoteClicked() {
    const payload = { text: this.state.currentNote };

    this.props.createNote(this.props.articleId, payload);

    this.setState({ currentNote: '' });
  }

  handleDeleteNote(note) {
    this.props.deleteNote(this.props.articleId, note.id);
  }

  renderNote(note) {
    return <Paper
      key={note.id}
      style={inlineStyles.notePaper}
    >
      <ReactMarkdown source={note.text} />
      <IconButton
        onTouchTap={() => this.handleDeleteNote(note)}
      >
        <DeleteForeverIcon />
      </IconButton>
    </Paper>;
  }

  render() {
    return (
      <Dialog
        autoDetectWindowHeight
        open
        title={'Notes'}
        titleStyle={inlineStyles.titleStyle}
        onRequestClose={this.props.handleClose}
      >
        <div style={inlineStyles.contentContainer}>
          {this.props.notes.map(this.renderNote)}
        </div>

        <Paper style={inlineStyles.paperStyle}>
          <TextField
            autoFocus
            fullWidth
            multiLine
            name="newnote"
            value={this.state.currentNote}
            onChange={(e, t) => this.setState({ currentNote: t })}
          />
          <RaisedButton
            disabled={this.state.currentNote === ''}
            label="Add note"
            primary
            onTouchTap={this.handleAddNoteClicked}
          />
        </Paper>
      </Dialog>
    );
  }
}

export default connect(null, {
  createNote,
  updateNote,
  deleteNote,
})(NotesPopup);

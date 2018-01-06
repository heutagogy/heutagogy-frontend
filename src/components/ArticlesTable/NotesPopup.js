/* eslint-disable react/jsx-no-bind */
import { connect } from 'react-redux';

import { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from './../Fields/RaisedButton';
import { createNote, updateNote, deleteNote } from './../../actions/notes';

import NotePaper from './NotePaper';


const inlineStyles = {
  titleStyle: {
    textAlign: 'center',
    padding: '15px',
  },
  paperStyle: {
    margin: '5px',
    padding: '10px',
  },
};

class NotesPopup extends Component {
  static propTypes = {
    articleId: PropTypes.number,
    createNote: PropTypes.func,
    deleteNote: PropTypes.func,
    handleClose: PropTypes.func,
    notes: PropTypes.array,
    updateNote: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentNote: '',
    };

    [
      'handleAddNoteClicked',
      'handleDeleteNote',
      'handleUpdateNote',
      'renderNote',
    ].forEach((method) => { this[method] = this[method].bind(this); });
  }

  handleAddNoteClicked() {
    const payload = { text: this.state.currentNote };

    this.props.createNote(this.props.articleId, payload);

    this.setState({ currentNote: '' });
  }

  handleDeleteNote(noteId) {
    this.props.deleteNote(this.props.articleId, noteId);
  }

  handleUpdateNote(noteId, newNote) {
    this.props.updateNote(this.props.articleId, noteId, newNote);
  }

  renderNote(note) {
    return <NotePaper
      key={note.id}
      note={note}
      onDeleteNote={() => this.handleDeleteNote(note.id)}
      onUpdateNote={(newNote) => this.handleUpdateNote(note.id, newNote)}
    />;
  }

  render() {
    return (
      <Dialog
        autoDetectWindowHeight
        contentStyle={{ width: '100%' }}
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

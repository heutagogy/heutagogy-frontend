/* eslint-disable react/jsx-no-bind */
import { connect } from 'react-redux';

import { Component, PropTypes } from 'react';

import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui-next/Dialog';
import Paper from 'material-ui-next/Paper';
import TextField from 'material-ui-next/TextField';
import Button from 'material-ui-next/Button';

import { createNote, updateNote, deleteNote } from './../../actions/notes';

import NotePaper from './NotePaper';
import { guid } from './../../../src/utils/stringUtils';


const inlineStyles = {
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
    fullScreen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
    notes: PropTypes.array,
    open: PropTypes.bool,
    title: PropTypes.string,
    updateNote: PropTypes.func,
  }

  static defaultProps = {
    open: true,
  };

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
    this.props.createNote(this.props.articleId, {
      text: this.state.currentNote,
      tmpId: guid(),
    });

    this.setState({ currentNote: '' });
  }

  handleDeleteNote({ noteId, text, noteIndex }) {
    this.props.deleteNote(this.props.articleId, { noteId, text, noteIndex });
  }

  handleUpdateNote({ noteId, newText, text }) {
    this.props.updateNote(this.props.articleId, { noteId, newText, text });
  }

  renderNote(note, index) {
    return <NotePaper
      key={note.id}
      note={note}
      onDeleteNote={() => this.handleDeleteNote({
        noteId: note.id, text: note.text, noteIndex: index,
      })}
      onUpdateNote={(newText) =>
        this.handleUpdateNote({ noteId: note.id, newText, text: note.text })}
    />;
  }

  render() {
    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          {this.props.notes.map(this.renderNote)}

          <Paper style={inlineStyles.paperStyle}>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              multiline
              name="newnote"
              value={this.state.currentNote}
              onChange={(e) => this.setState({ currentNote: e.target.value })}
            />
            <Button
              color="primary"
              disabled={this.state.currentNote === ''}
              raised
              onTouchTap={this.handleAddNoteClicked}
            >
              {'Add note'}
            </Button>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onTouchTap={this.props.handleClose}
          >
            {'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(null, {
  createNote,
  updateNote,
  deleteNote,
})(withMobileDialog()(NotesPopup));

import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';
import { guid } from './../../src/utils/stringUtils';


export const UPDATE_NOTE_START = 'UPDATE_NOTE_START';
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';

export const DELETE_NOTE_START = 'DELETE_NOTE_START';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';

export const CREATE_NOTE_START = 'CREATE_NOTE_START';
export const CREATE_NOTE_SUCCESS = 'CREATE_NOTE_SUCCESS';
export const CREATE_NOTE_FAILURE = 'CREATE_NOTE_FAILURE';


const postCreateNote = (bookmarkId, noteFields) => {
  const meta = { bookmarkId, note: { id: guid(), ...noteFields } };

  return {
    [CALL_API]: {
      types: [
        { type: CREATE_NOTE_START, meta },
        { type: CREATE_NOTE_SUCCESS, meta },
        { type: CREATE_NOTE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(noteFields),
      endpoint: `${API_VERSION}/bookmarks/${bookmarkId}/notes`,
    },
  };
};

const postDeleteNote = (bookmarkId, noteIndex, note) => {
  const meta = { bookmarkId, noteIndex, note };

  return {
    [CALL_API]: {
      types: [
        { type: DELETE_NOTE_START, meta },
        { type: DELETE_NOTE_SUCCESS, meta },
        { type: DELETE_NOTE_FAILURE, meta },
      ],
      method: 'DELETE',
      endpoint: `${API_VERSION}/notes/${note.id}`,
    },
  };
};

const postUpdateNote = (bookmarkId, newNote, oldNote) => {
  const meta = { bookmarkId, note: { ...oldNote, ...newNote }, oldNote };

  return {
    [CALL_API]: {
      types: [
        { type: UPDATE_NOTE_START, meta },
        { type: UPDATE_NOTE_SUCCESS, meta },
        { type: UPDATE_NOTE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(newNote),
      endpoint: `${API_VERSION}/notes/${oldNote.id}`,
    },
  };
};


export const createNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postCreateNote(bookmarkId, noteFields));

export const deleteNote = (bookmarkId, noteIndex, note) => (dispatch) =>
    dispatch(postDeleteNote(bookmarkId, noteIndex, note));

export const updateNote = (bookmarkId, newNote, oldNote) => (dispatch) =>
    dispatch(postUpdateNote(bookmarkId, newNote, oldNote));

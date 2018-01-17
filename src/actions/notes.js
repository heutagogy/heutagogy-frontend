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

const postDeleteNote = (bookmarkId, noteIndex, noteFields) => {
  const meta = { bookmarkId, note: noteFields, noteIndex };

  return {
    [CALL_API]: {
      types: [
        { type: DELETE_NOTE_START, meta },
        { type: DELETE_NOTE_SUCCESS, meta },
        { type: DELETE_NOTE_FAILURE, meta },
      ],
      method: 'DELETE',
      endpoint: `${API_VERSION}/notes/${noteFields.id}`,
    },
  };
};

const postUpdateNote = (bookmarkId, newNoteFields, oldNoteFields) => {
  const meta = { bookmarkId, note: newNoteFields, oldNote: oldNoteFields };

  return {
    [CALL_API]: {
      types: [
        { type: UPDATE_NOTE_START, meta },
        { type: UPDATE_NOTE_SUCCESS, meta },
        { type: UPDATE_NOTE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(newNoteFields),
      endpoint: `${API_VERSION}/notes/${newNoteFields.id}`,
    },
  };
};


export const createNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postCreateNote(bookmarkId, noteFields));

export const deleteNote = (bookmarkId, noteIndex, noteFields) => (dispatch) =>
    dispatch(postDeleteNote(bookmarkId, noteIndex, noteFields));

export const updateNote = (bookmarkId, newNoteFields, oldNoteFields) => (dispatch) =>
    dispatch(postUpdateNote(bookmarkId, newNoteFields, oldNoteFields));

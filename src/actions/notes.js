import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';

export const UPDATE_NOTE_START = 'UPDATE_NOTE_START';
export const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
export const UPDATE_NOTE_FAILURE = 'UPDATE_NOTE_FAILURE';

export const DELETE_NOTE_START = 'DELETE_NOTE_START';
export const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
export const DELETE_NOTE_FAILURE = 'DELETE_NOTE_FAILURE';

export const CREATE_NOTE_START = 'CREATE_NOTE_START';
export const CREATE_NOTE_SUCCESS = 'CREATE_NOTE_SUCCESS';
export const CREATE_NOTE_FAILURE = 'CREATE_NOTE_FAILURE';

const postUpdateNote = (noteId, noteFields) => ({
  [CALL_API]: {
    types: [
        { type: UPDATE_NOTE_START },
        { type: UPDATE_NOTE_SUCCESS },
        { type: UPDATE_NOTE_FAILURE },
    ],
    method: 'POST',
    body: JSON.stringify(noteFields),
    endpoint: `${API_VERSION}/notes/${noteId}`,
  },
});

const postDeleteNote = (noteId) => ({
  [CALL_API]: {
    types: [
        { type: DELETE_NOTE_START },
        { type: DELETE_NOTE_SUCCESS },
        { type: DELETE_NOTE_FAILURE },
    ],
    method: 'DELETE',
    endpoint: `${API_VERSION}/notes/${noteId}`,
  },
});

const postCreateNote = (bookmarkId, noteFields) => ({
  [CALL_API]: {
    types: [
        { type: CREATE_NOTE_START },
        { type: CREATE_NOTE_SUCCESS },
        { type: CREATE_NOTE_FAILURE },
    ],
    method: 'POST',
    body: JSON.stringify(noteFields),
    endpoint: `${API_VERSION}/bookmarks/${bookmarkId}/notes`,
  },
});

export const updateNote = (noteId, noteFields) => (dispatch) =>
    dispatch(postUpdateNote(noteId, noteFields));

export const createNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postCreateNote(bookmarkId, noteFields));

export const deleteNote = (noteId) => (dispatch) =>
    dispatch(postDeleteNote(noteId));

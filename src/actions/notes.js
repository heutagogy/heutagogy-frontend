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

const postUpdateNote = (bookmarkId, noteId, noteFields) => ({
  [CALL_API]: {
    types: [
        { type: UPDATE_NOTE_START, meta: { bookmarkId, noteId } },
        { type: UPDATE_NOTE_SUCCESS, meta: { bookmarkId, noteId } },
        { type: UPDATE_NOTE_FAILURE, meta: { bookmarkId, noteId } },
    ],
    method: 'POST',
    body: JSON.stringify(noteFields),
    endpoint: `${API_VERSION}/notes/${noteId}`,
  },
});

const postDeleteNote = (bookmarkId, noteId) => ({
  [CALL_API]: {
    types: [
        { type: DELETE_NOTE_START, meta: { bookmarkId, noteId } },
        { type: DELETE_NOTE_SUCCESS, meta: { bookmarkId, noteId } },
        { type: DELETE_NOTE_FAILURE, meta: { bookmarkId, noteId } },
    ],
    method: 'DELETE',
    endpoint: `${API_VERSION}/notes/${noteId}`,
  },
});

const postCreateNote = (bookmarkId, noteFields) => ({
  [CALL_API]: {
    types: [
        { type: CREATE_NOTE_START, meta: { bookmarkId } },
        { type: CREATE_NOTE_SUCCESS, meta: { bookmarkId } },
        { type: CREATE_NOTE_FAILURE, meta: { bookmarkId } },
    ],
    method: 'POST',
    body: JSON.stringify(noteFields),
    endpoint: `${API_VERSION}/bookmarks/${bookmarkId}/notes`,
  },
});

export const updateNote = (bookmarkId, noteId, noteFields) => (dispatch) =>
    dispatch(postUpdateNote(bookmarkId, noteId, noteFields));

export const createNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postCreateNote(bookmarkId, noteFields));

export const deleteNote = (bookmarkId, noteId) => (dispatch) =>
    dispatch(postDeleteNote(bookmarkId, noteId));

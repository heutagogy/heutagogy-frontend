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


const postCreateNote = (bookmarkId, { text }) => {
  const meta = { bookmarkId, note: { text } };

  return {
    [CALL_API]: {
      types: [
        { type: CREATE_NOTE_START, meta },
        { type: CREATE_NOTE_SUCCESS, meta },
        { type: CREATE_NOTE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify({ text }),
      endpoint: `${API_VERSION}/bookmarks/${bookmarkId}/notes`,
    },
  };
};

const postDeleteNote = (bookmarkId, { noteId, text, noteIndex }) => {
  const meta = { bookmarkId, note: { id: noteId, text, index: noteIndex } };

  return {
    [CALL_API]: {
      types: [
        { type: DELETE_NOTE_START, meta },
        { type: DELETE_NOTE_SUCCESS, meta },
        { type: DELETE_NOTE_FAILURE, meta },
      ],
      method: 'DELETE',
      endpoint: `${API_VERSION}/notes/${noteId}`,
    },
  };
};

const postUpdateNote = (bookmarkId, { noteId, newText, text }) => {
  const meta = { bookmarkId, note: { id: noteId, newText, text } };

  return {
    [CALL_API]: {
      types: [
        { type: UPDATE_NOTE_START, meta },
        { type: UPDATE_NOTE_SUCCESS, meta },
        { type: UPDATE_NOTE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify({ text: newText }),
      endpoint: `${API_VERSION}/notes/${noteId}`,
    },
  };
};


export const createNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postCreateNote(bookmarkId, noteFields));

export const deleteNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postDeleteNote(bookmarkId, noteFields));

export const updateNote = (bookmarkId, noteFields) => (dispatch) =>
    dispatch(postUpdateNote(bookmarkId, noteFields));

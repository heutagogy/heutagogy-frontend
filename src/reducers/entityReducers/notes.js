import Immutable from 'immutable';

import {
  DELETE_NOTE_START,
  CREATE_NOTE_START,
  UPDATE_NOTE_START,
  DELETE_NOTE_FAILURE,
  CREATE_NOTE_FAILURE,
  UPDATE_NOTE_FAILURE,
  CREATE_NOTE_SUCCESS,
} from './../../actions/notes';
import { MINUS_ONE, ZERO } from './../../constants/Constants';


const updateArticle = (notesAction, bookmarkId, state) => {
  const articleIndex = state.get('article').findIndex((el) =>
    el.get('id') === bookmarkId);

  if (articleIndex === MINUS_ONE) {
    return state;
  }

  const newArticle = state.getIn(['article', articleIndex]).update('notes', notesAction);

  return state.setIn(['article', articleIndex], newArticle);
};

export default (state, action) => {
  switch (action.type) {


    case CREATE_NOTE_START: {
      return updateArticle(
        (old) => old.push(Immutable.fromJS({
          id: action.meta.note.tmpId,
          text: action.meta.note.text,
        })),
        action.meta.bookmarkId,
        state,
      );
    }
    case CREATE_NOTE_SUCCESS: {
      return updateArticle(
        (old) =>
          old.map((note) =>
            (note.get('id') === action.meta.note.tmpId
              ? Immutable.fromJS({
                id: action.payload.id,
                text: action.meta.note.text,
              })
              : note)),
        action.meta.bookmarkId,
        state,
      );
    }
    case CREATE_NOTE_FAILURE: {
      return updateArticle(
        (old) =>
          old.filterNot((note) =>
            note.get('id') === action.meta.note.tmpId),
        action.meta.bookmarkId,
        state,
      );
    }


    case DELETE_NOTE_START: {
      return updateArticle(
        (old) =>
          old.filterNot((note) =>
            note.get('id') === action.meta.note.id),
        action.meta.bookmarkId,
        state
      );
    }
    case DELETE_NOTE_FAILURE: {
      return updateArticle(
        (old) => old.splice(
          action.meta.note.index,
          ZERO,
          Immutable.fromJS({
            id: action.meta.note.id,
            text: action.meta.note.text,
          })
        ),
        action.meta.bookmarkId,
        state
      );
    }


    case UPDATE_NOTE_START: {
      return updateArticle(
        (old) =>
          old.map((note) =>
            (note.get('id') === action.meta.note.id
              ? Immutable.fromJS({
                id: action.meta.note.id,
                text: action.meta.note.newText,
              })
              : note)),
        action.meta.bookmarkId,
        state
      );
    }
    case UPDATE_NOTE_FAILURE: {
      return updateArticle(
        (old) =>
          old.map((note) =>
            (note.get('id') === action.meta.note.id
              ? Immutable.fromJS({
                id: action.meta.note.id,
                text: action.meta.note.text,
              })
              : note)),
        action.meta.bookmarkId,
        state
      );
    }


    default: {
      return state;
    }


  }
};

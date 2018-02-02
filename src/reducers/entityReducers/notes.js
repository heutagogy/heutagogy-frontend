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
import { ZERO } from './../../constants/Constants';


const updateArticle = (notesAction, bookmarkId, state) => (
  state.updateIn(['articles', String(bookmarkId), 'notes'], (old) => notesAction(old || Immutable.fromJS([])))
);

export default (state, action) => {
  switch (action.type) {


    case CREATE_NOTE_START: {
      return updateArticle(
        (old) => old.push(Immutable.fromJS(action.meta.note.id)),
        action.meta.bookmarkId,
        state,
      ).setIn(['notes', String(action.meta.note.id)], Immutable.fromJS(action.meta.note));
    }
    case CREATE_NOTE_SUCCESS: {
      return updateArticle(
        (old) =>
          old.map((id) =>
            (id === action.meta.note.id
              ? action.payload.id
              : id)),
        action.meta.bookmarkId,
        state,
      ).deleteIn(['notes', String(action.meta.note.id)]).setIn(['notes', String(action.payload.id)], action.payload);
    }
    case CREATE_NOTE_FAILURE: {
      return updateArticle(
        (old) =>
          old.filterNot((note) =>
            note.get('id') === action.meta.note.id),
        action.meta.bookmarkId,
        state,
      ).deleteIn(['notes', String(action.meta.note.id)]);
    }


    case DELETE_NOTE_START: {
      return updateArticle(
        (old) =>
          old.filterNot((noteId) =>
            noteId === action.meta.note.id),
        action.meta.bookmarkId,
        state
      );
    }
    case DELETE_NOTE_FAILURE: {
      return updateArticle(
        (old) => old.splice(
          action.meta.noteIndex,
          ZERO,
          action.meta.note.id
        ),
        action.meta.bookmarkId,
        state
      );
    }


    case UPDATE_NOTE_START: {
      return state.updateIn(['notes', String(action.meta.oldNote.id)],
                            (old) => old.merge(action.meta.note));
    }
    case UPDATE_NOTE_FAILURE: {
      return state.setIn(['notes', String(action.meta.oldNote.id)],
                         action.meta.oldNote);
    }


    default: {
      return state;
    }


  }
};

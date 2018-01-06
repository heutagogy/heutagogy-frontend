import { DELETE_NOTE_SUCCESS, CREATE_NOTE_SUCCESS, UPDATE_NOTE_SUCCESS } from './../../actions/notes';
import { MINUS_ONE } from './../../constants/Constants';


export default (state, action) => {
  switch (action.type) {
    case CREATE_NOTE_SUCCESS: {
      const articleIndex = state.get('article').findIndex((el) => el.get('id') === action.meta.bookmarkId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      const newArticle = state.getIn(['article', articleIndex]).update('notes', (old) => old.push(action.payload));

      return state.setIn(['article', articleIndex], newArticle);
    }
    case DELETE_NOTE_SUCCESS: {
      const articleIndex = state.get('article').findIndex((el) => el.get('id') === action.meta.bookmarkId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      const newArticle = state.getIn(['article', articleIndex]).update('notes', (old) =>
        old.filterNot((note) => note.id === action.meta.noteId));

      return state.setIn(['article', articleIndex], newArticle);
    }
    case UPDATE_NOTE_SUCCESS: {
      const articleIndex = state.get('article').findIndex((el) => el.get('id') === action.meta.bookmarkId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      const newArticle = state.getIn(['article', articleIndex]).update('notes', (old) =>
        old.map((note) => (note.id === action.meta.noteId ? action.payload : note)));

      return state.setIn(['article', articleIndex], newArticle);
    }
    default: {
      return state;
    }
  }
};

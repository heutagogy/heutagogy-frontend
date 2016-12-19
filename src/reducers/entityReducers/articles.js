import Immutable from 'immutable';
import { REMEMBER_ARTICLE_START } from './../../actions/articles';

const articles = (state, action) => {
  switch (action.type) {
    case REMEMBER_ARTICLE_START: {
      const prevState = state.get('article') || Immutable.fromJS([]);

      return prevState.merge(action.meta.articles);
    }
    default:
      return state;
  }
};

export default articles;

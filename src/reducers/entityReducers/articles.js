import Immutable from 'immutable';

import { UPDATE_ARTICLE_SUCCESS, DELETE_ARTICLE_SUCCESS, REMEMBER_ARTICLES_SUCCESS } from './../../actions/articles';
import { MINUS_ONE } from './../../constants/Constants';


export default (state, action) => {
  switch (action.type) {
    case UPDATE_ARTICLE_SUCCESS: {
      const articlePayload = action.payload.getIn(['entities', 'article']).first();
      const articleIndex = state.get('article').findIndex((el) => el.get('id') === action.meta.articleId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      const newArticles = state.get('article').set(articleIndex, articlePayload);

      return state.set('article', newArticles);
    }
    case DELETE_ARTICLE_SUCCESS: {
      const articleIndex = state.get('article').findIndex((el) => el.get('id') === action.meta.articleId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      return state.deleteIn(['article', articleIndex]);
    }
    case REMEMBER_ARTICLES_SUCCESS: {
      const articles = Immutable.fromJS(action.payload.getIn(['entities', 'article'])).toList();
      const newArticles = articles.concat(state.get('article'));

      return state.set('article', newArticles);
    }
    default: {
      return state;
    }
  }
};

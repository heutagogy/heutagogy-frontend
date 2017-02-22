import { UPDATE_ARTICLE_SUCCESS, DELETE_ARTICLE_SUCCESS } from './../../actions/articles';
import { MINUS_ONE } from './../../constants/Constants';


export default (state, action) => {
  switch (action.type) {
    case UPDATE_ARTICLE_SUCCESS: {
      const articlePayload = action.payload.getIn(['entities', 'article']).first();
      const articleIndex = state.getIn(['article']).findIndex((el) => el.get('id') === action.meta.articleId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      const newArticles = state.getIn(['article']).set(articleIndex, articlePayload);

      return state.setIn(['article'], newArticles);
    }
    case DELETE_ARTICLE_SUCCESS: {
      const articleIndex = state.getIn(['article']).findIndex((el) => el.get('id') === action.meta.articleId);

      if (articleIndex === MINUS_ONE) {
        return state;
      }

      return state.deleteIn(['article', articleIndex]);
    }
    default: {
      return state;
    }
  }
};

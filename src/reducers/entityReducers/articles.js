import Immutable from 'immutable'

import {
  UPDATE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_SUCCESS,
  REMEMBER_ARTICLES_SUCCESS
} from './../../actions/articles'

export default (state, action) => {
  // See https://github.com/agraboso/redux-api-middleware/issues/44
  const type = !action.error
    ? action.type
    : action.type.replace(/_START$/, '_FAILURE')

  switch (type) {
    case REMEMBER_ARTICLES_SUCCESS:
    case UPDATE_ARTICLE_SUCCESS: {
      const oldArticles = state.getIn(['articles']) || Immutable.fromJS({})
      const articles = action.payload.getIn(['entities', 'articles'])

      const withUpdatedArticles = state.setIn(
        ['articles'],
        oldArticles.merge(articles)
      )

      return action.type === REMEMBER_ARTICLES_SUCCESS
        ? withUpdatedArticles.updateIn(['articlesServerOrder'], old =>
            old.unshift(action.payload.getIn(['result']))
          )
        : withUpdatedArticles
    }
    case DELETE_ARTICLE_SUCCESS: {
      const articleId = String(action.meta.articleId)

      return state.deleteIn(['articles', articleId])
    }
    default: {
      return state
    }
  }
}

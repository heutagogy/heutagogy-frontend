import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';
import { REMEMBER_ARTICLES_VIEW_STATE } from './../constants/ViewStates';

export const REMEMBER_ARTICLE_START = 'REMEMBER_ARTICLE_START';
export const REMEMBER_ARTICLE_SUCCESS = 'REMEMBER_ARTICLE_SUCCESS';
export const REMEMBER_ARTICLE_FAILURE = 'REMEMBER_ARTICLE_FAILURE';

const postRememberArticles = ({ articles }) => {
  const meta = { viewId: REMEMBER_ARTICLES_VIEW_STATE, articles };

  return {
    [CALL_API]: {
      types: [
        { type: REMEMBER_ARTICLE_START, meta },
        { type: REMEMBER_ARTICLE_SUCCESS, meta },
        { type: REMEMBER_ARTICLE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(articles.toJS()),
      endpoint: `${API_VERSION}/bookmarks`,
    },
  };
};

export const rememberArticles = ({ articles }) => (dispatch) => dispatch(postRememberArticles({ articles }));

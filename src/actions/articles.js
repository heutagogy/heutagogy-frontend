import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';
import { REMEMBER_ARTICLES_VIEW_STATE, UPDATE_ARTICLE_VIEW_STATE, DELETE_ARTICLE_VIEW_STATE } from './../constants/ViewStates';
import schemaUtils from './../utils/schemaUtils';
import articleSchema from './../schemas/article';


export const REMEMBER_ARTICLES_START = 'REMEMBER_ARTICLE_START';
export const REMEMBER_ARTICLES_SUCCESS = 'REMEMBER_ARTICLE_SUCCESS';
export const REMEMBER_ARTICLES_FAILURE = 'REMEMBER_ARTICLE_FAILURE';

export const UPDATE_ARTICLE_START = 'UPDATE_ARTICLE_START';
export const UPDATE_ARTICLE_SUCCESS = 'UPDATE_ARTICLE_SUCCESS';
export const UPDATE_ARTICLE_FAILURE = 'UPDATE_ARTICLE_FAILURE';

export const DELETE_ARTICLE_START = 'DELETE_ARTICLE_START';
export const DELETE_ARTICLE_SUCCESS = 'DELETE_ARTICLE_SUCCESS';
export const DELETE_ARTICLE_FAILURE = 'DELETE_ARTICLE_FAILURE';

const postRememberArticles = ({ articles }) => {
  const meta = { viewId: REMEMBER_ARTICLES_VIEW_STATE, articles };

  return {
    [CALL_API]: {
      types: [
        { type: REMEMBER_ARTICLES_START, meta },
        schemaUtils.getSuccessActionTypeWithSchema({
          type: REMEMBER_ARTICLES_SUCCESS,
          schema: articleSchema,
          meta,
        }),
        { type: REMEMBER_ARTICLES_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(articles.toJS()),
      endpoint: `${API_VERSION}/bookmarks`,
    },
  };
};

const postUpdateArticle = (articleId, articleFields) => {
  const meta = { viewId: UPDATE_ARTICLE_VIEW_STATE, articleId };

  return {
    [CALL_API]: {
      types: [
        { type: UPDATE_ARTICLE_START, meta },
        schemaUtils.getSuccessActionTypeWithSchema({
          type: UPDATE_ARTICLE_SUCCESS,
          schema: articleSchema,
          meta,
        }),
        { type: UPDATE_ARTICLE_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify(articleFields),
      endpoint: `${API_VERSION}/bookmarks/${articleId}`,
    },
  };
};


const deleteDeleteArticle = (articleId) => {
  const meta = { viewId: DELETE_ARTICLE_VIEW_STATE, articleId };

  return {
    [CALL_API]: {
      types: [
        { type: DELETE_ARTICLE_START, meta },
        { type: DELETE_ARTICLE_SUCCESS, meta },
        { type: DELETE_ARTICLE_FAILURE, meta },
      ],
      method: 'DELETE',
      endpoint: `${API_VERSION}/bookmarks/${articleId}`,
    },
  };
};


export const rememberArticles = ({ articles }) => (dispatch) => dispatch(postRememberArticles({ articles }));

export const updateArticle = (articleId, articleFields) => (dispatch) => dispatch(postUpdateArticle(articleId, articleFields));

export const deleteArticle = (articleId) => (dispatch) => dispatch(deleteDeleteArticle(articleId));

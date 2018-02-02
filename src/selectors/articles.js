import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getArticlesMap = (state) => state.getIn(['entities', 'articles']);

export const getArticles = createSelector(
  [getArticlesMap],
  (articles) => articles || Immutable.fromJS({})
);

const getArticleOrderList = (state) => state.getIn(['entities', 'articlesServerOrder']);

export const getArticlesOrder = createSelector(
  [getArticleOrderList],
  (order) => order || Immutable.fromJS([])
);

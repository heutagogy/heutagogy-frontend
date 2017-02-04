import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getArticlesList = (state) => state.getIn(['entities', 'article']);

export const getArticles = createSelector(
  [getArticlesList],
  (articles) => articles && articles.toList() || new Immutable.List()
);

import { createSelector } from 'reselect';
import Immutable from 'immutable';

// TODO in future this logic should be changed to get data by query from location
const getFilteredArticlesList = (state) => state.getIn(['entities', 'article']);

export const getFilteredArticles = createSelector(
  [getFilteredArticlesList],
  (articles) => articles && articles.toList() || new Immutable.List()
);

const getAppData = (state, props) => state.getIn(['entities', 'articles', props.routeParams.name]);

export const getApp = createSelector(
  [getAppData],
  (app) => app || new Immutable.Map()
);

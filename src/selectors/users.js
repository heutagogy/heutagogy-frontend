import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getAuthenticatedUserData = (state) => state.getIn(['entities', 'authUser']);

export const getAuthenticatedUser = createSelector(
  [getAuthenticatedUserData],
  (app) => app || new Immutable.Map()
);

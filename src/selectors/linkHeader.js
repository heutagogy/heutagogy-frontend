import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getLinkHeaderData = (state) => state.getIn(['entities', 'headers', 'link']);

export const getLinkHeader = createSelector(
  [getLinkHeaderData],
  (res) => res || new Immutable.Map()
);

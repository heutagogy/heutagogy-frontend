// @flow

import { fromJS } from 'immutable';
import {
  GET_STAT_SUCCESS,
} from './../../actions/statistic';
import type { Action } from './../../actions/statisticTypes';
import type { State } from './statisticTypes';

const statistic = (state: State, action: Action) => {
  switch (action.type) {
    case GET_STAT_SUCCESS: {
      return fromJS(state).set('stat', action.payload);
    }
    default:
      return state;
  }
};

export default statistic;

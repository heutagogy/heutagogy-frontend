// @flow
import { fromJS } from 'immutable';
import type { State } from '../containers/HeaderBar/components/Stat/types';
import type { Stat } from '../actions/statisticTypes';

const fallbackStat: Stat = {
  total_read: 0,
  total_read_7days: 0,
  user_read_today: 0,
  user_read_year: 0,
  user_read: 0,
};

export const getStat = (state: State): Stat =>
  fromJS(state).getIn(['entities', 'stat']) || fallbackStat;

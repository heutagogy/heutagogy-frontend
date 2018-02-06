// @flow

import { RSAA } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';

import type { Dispatch, Action } from './statisticTypes';


export const GET_STAT_START = 'GET_STAT_START';
export const GET_STAT_SUCCESS = 'GET_STAT_SUCCESS';
export const GET_STAT_FAILURE = 'GET_STAT_FAILURE';

// TODO: remove any
const getStat = (): any => ({
  [RSAA]: {
    types: [
        { type: GET_STAT_START },
        { type: GET_STAT_SUCCESS },
        { type: GET_STAT_FAILURE },
    ],
    method: 'GET',
    endpoint: `${API_VERSION}/stats`,
  },
});


export const getStatistic = () => (dispatch: Dispatch): Action =>
    dispatch(getStat());

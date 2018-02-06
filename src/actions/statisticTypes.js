// @flow

export type Stat = {
  total_read: number,
  total_read_7days: number,
  user_read_today?: number,
  user_read_year?: number,
  user_read?: number
}

export type Action = {
  type: 'GET_STAT_SUCCESS',
  payload: Stat
}

type ThunkAction = (dispatch: Dispatch) => any

type PromiseAction = Promise<Action>

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any

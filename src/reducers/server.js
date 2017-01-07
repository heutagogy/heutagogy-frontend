import Immutable from 'immutable';

import { SET_SERVER_ADDRESS } from './../actions/server';

import localStorageUtils from './../utils/localStorageUtils';

const initialState = Immutable.fromJS({
  address: 'http://localhost:5000',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVER_ADDRESS: {
      localStorageUtils.setServerInfo(Immutable.fromJS({
        address: action.address,
      }));

      return state.set('address', action.address);
    }
    default: {
      return state;
    }
  }
};

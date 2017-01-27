import Immutable from 'immutable';
import { USER_LOGIN_STARTED, USER_LOGIN_SUCCESS, USER_LOGOUT } from './../../actions/users';
import localStorageUtils from './../../utils/localStorageUtils';

const users = (state, action) => {
  switch (action.type) {
    case USER_LOGOUT:
    case USER_LOGIN_STARTED: {
      localStorageUtils.setAuthinticatedUser({});

      return state.set('authUser', new Immutable.Map());
    }
    case USER_LOGIN_SUCCESS: {
      const user = action.payload.getIn(['entities', 'authUser']).toList().first();
      const userWithLogin = user.set('login', action.meta.login);

      localStorageUtils.setAuthinticatedUser(userWithLogin);

      return state.set('authUser', userWithLogin);
    }
    default:
      return state;
  }
};

export default users;

import { CALL_API } from 'redux-api-middleware';
import { API_VERSION } from './../constants/Api';
import { LOGIN_VIEW_STATE } from './../constants/ViewStates';

import schemaUtils from './../utils/schemaUtils';
import authUserSchema from './../schemas/authUser';


export const USER_LOGIN_STARTED = 'USER_LOGIN_STARTED';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

const fetchUserLogin = ({ login, password }) => {
  const meta = { viewId: LOGIN_VIEW_STATE, login };

  return {
    [CALL_API]: {
      types: [
        { type: USER_LOGIN_STARTED, meta },
        schemaUtils.getSuccessActionTypeWithSchema({ type: USER_LOGIN_SUCCESS, schema: authUserSchema, meta }),
        { type: USER_LOGIN_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify({
        username: login,
        password,
      }),
      endpoint: `${API_VERSION}/login`,
    },
  };
};

const doGoogleSignIn = ({ googleUser }) => {
  const idToken = googleUser.getAuthResponse().id_token;

  const profile = googleUser.getBasicProfile();
  const name = profile.getName();

  const meta = { viewId: LOGIN_VIEW_STATE, login: name };

  return {
    [CALL_API]: {
      types: [
        { type: USER_LOGIN_STARTED, meta },
        schemaUtils.getSuccessActionTypeWithSchema({ type: USER_LOGIN_SUCCESS, schema: authUserSchema, meta }),
        { type: USER_LOGIN_FAILURE, meta },
      ],
      method: 'POST',
      body: JSON.stringify({
        id_token: idToken,
      }),
      endpoint: `${API_VERSION}/login`,
    },
  };
};

export const loginUser = ({ login, password }) => (dispatch) => dispatch(fetchUserLogin({ login, password }));

export const googleSignIn = (param) => (dispatch) => dispatch(doGoogleSignIn(param));

export const USER_LOGOUT = 'USER_LOGOUT';

export const logoutUser = () => (dispatch) => {
  /* eslint-disable no-undef */
  if (!gapi.auth2) {
    gapi.load('client:auth2', () =>
      gapi.auth2.init().then(() => logoutUser()(dispatch)));
  } else {
    gapi.auth2.getAuthInstance().signOut().then(() =>
      dispatch({ type: USER_LOGOUT }));
  }
  /* eslint-enable no-undef */
};

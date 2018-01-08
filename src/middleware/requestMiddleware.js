/* eslint-disable fp/no-mutation */
/* eslint-disable no-param-reassign */
import { CALL_API } from 'redux-api-middleware';
import { SERVER_URL } from './../constants/Api';
import localStorageUtils from './../utils/localStorageUtils';

const requestMiddleware = (_store) => (next) => (action) => {
  if (action[CALL_API]) {
    const headers = action[CALL_API].headers = action[CALL_API].headers || {};
    const method = action[CALL_API].method;
    // TODO(rasendubi): authenticated user data should be taken from store
    const user = localStorageUtils.getAuthenticatedUser();

    if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
      headers['Content-Type'] = 'application/json';

      action[CALL_API].endpoint = `${SERVER_URL}/${action[CALL_API].endpoint}`;

      if (user) {
        headers.Authorization = headers.Authorization || `JWT ${user.get('access_token')}`;
      }

      return next(action);
    }
  }

  return next(action);
};

export default requestMiddleware;

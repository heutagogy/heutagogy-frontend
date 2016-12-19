/* eslint-disable fp/no-mutation */
import { CALL_API } from 'redux-api-middleware';
import localStorageUtils from './../utils/localStorageUtils';

const headerMiddleware = () => () => (next) => (action) => {
  if (action[CALL_API]) {
    const headers = action[CALL_API].headers = action[CALL_API].headers || {}; // eslint-disable-line
    const method = action[CALL_API].method;
    const token = localStorageUtils.getAuthToken();

    if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
      headers.Authorization = headers.Authorization || token;
      headers['Content-Type'] = 'application/json';

      return next(action);
    }
  }

  return next(action);
};

export default headerMiddleware();

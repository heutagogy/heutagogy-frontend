/* eslint-disable fp/no-mutation */
import { CALL_API } from 'redux-api-middleware';
import localStorageUtils from './../utils/localStorageUtils';

const requestMiddleware = () => () => (next) => (action) => {
  if (action[CALL_API]) {
    const headers = action[CALL_API].headers = action[CALL_API].headers || {}; // eslint-disable-line
    const method = action[CALL_API].method;
    const token = localStorageUtils.getAuthinticatedUser().get('access_token');
    const serverAddress = localStorageUtils.getServerInfo().get('address');

    // TODO handle http://127.0.0.1:1234/ vs http://127.0.0.1:1234
    action[CALL_API].endpoint = serverAddress + action[CALL_API].endpoint; // eslint-disable-line

    if (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') {
      headers['Content-Type'] = 'application/json';
      headers.Authorization = headers.Authorization || `JWT ${token}`;

      return next(action);
    }
  }

  return next(action);
};

export default requestMiddleware();

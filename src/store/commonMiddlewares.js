import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import rootReducer from '../reducers';
import { mockApiMiddleware } from '../mockApi';
import requestMiddleware from './../middleware/requestMiddleware';

export const basicMiddleware = [
  rootReducer,
];

export const middlewaresToApply = [
  thunk,
  mockApiMiddleware,
  requestMiddleware,
  apiMiddleware,
  routerMiddleware(browserHistory),
];

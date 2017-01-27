import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import dataView from './dataView';
import routing from './routing';
import server from './server';
import view from './view';

import * as entityReducers from './entityReducers';


const entities = (state = Immutable.fromJS({ authUser: {} }), action) =>
      Object.keys(entityReducers).reduce((prev, key) => entityReducers[key](prev, action), state);

export default combineReducers({
  dataView,
  entities,
  form: formReducer,
  routing,
  server,
  view,
});

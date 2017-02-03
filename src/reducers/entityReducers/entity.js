/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */

import Immutable from 'immutable';
import { LOAD_ENTITIES_SUCCESS } from './../../actions/entity';


export default (state, action) => {
  switch (action.type) {
    case LOAD_ENTITIES_SUCCESS: {
      const stateWithHeaders = state.setIn(['headers'], action.payload.get('headers'));
      const payloadArticles = action.payload.getIn(['entities', 'article']);
      const serverOrderIds = action.payload.get('result');
      let articles = Immutable.fromJS([]);

      serverOrderIds.forEach((id) => {
        articles = articles.push(payloadArticles.get(id.toString()));
      });

      return stateWithHeaders.set('article', articles);
    }
    default: {
      return state;
    }
  }
};

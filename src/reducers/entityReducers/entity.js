/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */

import Immutable from 'immutable';
import { LOAD_ENTITIES_SUCCESS } from './../../actions/entity';


export default (state, action) => {
  switch (action.type) {
    case LOAD_ENTITIES_SUCCESS: {
      // set link header, if there is no link header − reset it
      const stateWithHeaders = state.setIn(['headers'], action.payload.getIn(['headers']) || Immutable.fromJS({}));

      const payloadArticles = action.payload.getIn(['entities', 'article']);
      const serverOrderIds = action.payload.getIn(['result']);
      let articles = action.meta.resetState ? Immutable.fromJS([]) : state.getIn(['article']);

      serverOrderIds.forEach((id) => {
        articles = articles.push(payloadArticles.get(id.toString()));
      });

      return stateWithHeaders.setIn(['article'], articles);
    }
    default: {
      return state;
    }
  }
};

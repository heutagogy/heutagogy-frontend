/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */

import Immutable from 'immutable';
import { LOAD_ENTITIES_SUCCESS } from './../../actions/entity';


export default (state, action) => {
  switch (action.type) {
    case LOAD_ENTITIES_SUCCESS: {
      const resetState = action.meta.resetState;

      // set link header, if there is no link header − reset it
      const stateWithHeaders = state.setIn(['headers'], action.payload.getIn(['headers']) || Immutable.fromJS({}));

      const oldArticles = resetState ? Immutable.fromJS({}) : state.getIn(['articles']);
      const oldServerOrderIds = resetState ? Immutable.fromJS([]) : state.getIn(['articlesServerOrder']);

      const payloadArticles = action.payload.getIn(['entities', 'article']);
      const serverOrderIds = action.payload.getIn(['result']);

      return stateWithHeaders .
        setIn(['articles'], oldArticles.merge(payloadArticles)) .
        setIn(['articlesServerOrder'], oldServerOrderIds.concat(serverOrderIds));
    }
    default: {
      return state;
    }
  }
};

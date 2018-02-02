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
      const oldNotes = resetState ? Immutable.fromJS({}) : state.getIn(['notes']);
      const oldServerOrderIds = resetState ? Immutable.fromJS([]) : state.getIn(['articlesServerOrder']);

      const payloadArticles = action.payload.getIn(['entities', 'articles']);
      const payloadNotes = action.payload.getIn(['entities', 'notes']);
      const serverOrderIds = action.payload.getIn(['result']);

      return stateWithHeaders .
        setIn(['articles'], oldArticles.merge(payloadArticles)).
        setIn(['notes'], oldNotes.merge(payloadNotes)).
        setIn(['articlesServerOrder'], oldServerOrderIds.concat(serverOrderIds));
    }
    default: {
      return state;
    }
  }
};

/* eslint-disable fp/no-let */
/* eslint-disable fp/no-mutation */
// import Immutable from 'immutable';
import { LOAD_ENTITIES_SUCCESS } from './../../actions/entity';

export default (state, action) => {
  switch (action.type) {
    case LOAD_ENTITIES_SUCCESS: {
      const entities = action.payload.get('entities');

      let result = state.delete('article');

      entities.forEach((theEntities, entityType) => {
        theEntities.forEach((entity, entityId) => {
          result = result.mergeIn([entityType, entityId], entity);
        });
      });

      result = result.setIn(['headers'], action.payload.get('headers'));

      return result;
    }
    default: {
      return state;
    }
  }
};

import Immutable from 'immutable'
import {
  LOAD_ENTITIES_SUCCESS,
  LOAD_CONTENT_SUCCESS
} from './../../actions/entity'

export default (state, action) => {
  // See https://github.com/agraboso/redux-api-middleware/issues/44
  const type = !action.error
    ? action.type
    : action.type.replace(/_START$/, '_FAILURE')

  switch (type) {
    case LOAD_ENTITIES_SUCCESS: {
      const resetState = action.meta.resetState

      // set link header, if there is no link header − reset it
      const stateWithHeaders = state.setIn(
        ['headers'],
        action.payload.getIn(['headers']) || Immutable.fromJS({})
      )

      const oldArticles = resetState
        ? Immutable.fromJS({})
        : state.getIn(['articles'])
      const oldNotes = resetState
        ? Immutable.fromJS({})
        : state.getIn(['notes'])
      const oldServerOrderIds = resetState
        ? Immutable.fromJS([])
        : state.getIn(['articlesServerOrder'])

      const payloadArticles = action.payload.getIn(['entities', 'articles'])
      const payloadNotes = action.payload.getIn(['entities', 'notes'])
      const serverOrderIds = action.payload.getIn(['result'])

      return stateWithHeaders
        .setIn(['articles'], oldArticles.merge(payloadArticles))
        .setIn(['notes'], oldNotes.merge(payloadNotes))
        .setIn(
          ['articlesServerOrder'],
          oldServerOrderIds.concat(serverOrderIds)
        )
    }

    case LOAD_CONTENT_SUCCESS: {
      return state.setIn(
        ['articles', String(action.meta.articleId), 'content'],
        Immutable.fromJS(action.payload)
      )
    }

    default: {
      return state
    }
  }
}

import { normalize } from 'normalizr'
import Immutable from 'immutable'
import parse from 'parse-link-header'

import { NOT_FOUND, EMPTY_VALUE } from './../constants/Constants'

class SchemaUtils {
  getSuccessActionTypeWithSchema({ type, schema, meta }) {
    return {
      type,
      meta,
      payload: (action, state, res) => {
        const contentType = res.headers.get('Content-Type')
        const link = res.headers.get('Link')

        if (contentType && contentType.indexOf('json') !== NOT_FOUND) {
          return res.json().then(json => {
            const data = Immutable.fromJS(normalize(json, schema))

            if (link !== null) {
              return data.setIn(
                ['headers', 'link'],
                Immutable.fromJS(parse(link))
              )
            }

            return data
          })
        }

        return EMPTY_VALUE
      }
    }
  }
}

const schemaUtils = new SchemaUtils()

export default schemaUtils

/* eslint-disable no-param-reassign */
/* eslint-disable fp/no-mutation */

import { schema } from 'normalizr';
import moment from 'moment';
import { decodeUnicode } from './../utils/base64';

const options = {
  processStrategy(input) {
    const { access_token } = input;
    const data = JSON.parse(decodeUnicode(access_token.split('.')[1]));
    const exp = moment.unix(data.exp).format();

    return { access_token, exp };
  },
  idAttribute({ access_token }) {
    const data = JSON.parse(decodeUnicode(access_token.split('.')[1]));

    return data.identity;
  },
};

const user = new schema.Entity('authUser', {}, options);

export default user;

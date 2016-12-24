import moment from 'moment';

class UserUtils {
  isAuthenticated(userData) {
    if (!userData) {
      return false;
    }

    const now = moment();
    const isNotExpired = userData.get('exp')
          ? now.isSameOrBefore(moment(userData.get('exp')))
          : false;

    return userData.get('access_token') && isNotExpired;
  }
}


export default new UserUtils();

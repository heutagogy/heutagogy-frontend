import moment from 'moment';

export const formatTimeToUser = (timeStr) => moment.utc(timeStr).local().format('lll');

// @flow
// TODO: remove eslint hack
import React from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import IconButton from 'material-ui-next/IconButton';
import Tooltip from 'material-ui-next/Tooltip';
import Star from 'material-ui-icons/Star';

import { getStat } from 'src/selectors/statistic';
import { getStatistic } from 'src/actions/statistic';
import type { Props, State } from './types';


const StarStat = (props: Props): React$Element<*> => {
  const title = <p>
    <span><b>{`Read today: ${props.stat.user_read_today || 0}`}</b></span><br />
    <span>{`Read year: ${props.stat.user_read_year || 0}`}</span><br />
    <span>{`Read: ${props.stat.user_read || 0}`}</span><br />
    <span>{`Total read: ${props.stat.total_read || 0}`}</span><br />
    <span>{`Total read (last 7 days): ${props.stat.total_read_7days || 0}`}</span><br />
  </p>;

  const handeStarClick = props.getStatistic;

  return (
    <Tooltip
      id="tooltip-bottom-start"
      title={title}
    >
      <IconButton onClick={handeStarClick} >
        <Star
          color={(props.stat.user_read_today || 0) > 0 ? 'blue' : null}
        />
      </IconButton>
    </Tooltip>
  );
};

const mapStateToProps = (state: State) => ({
  stat: getStat(state),
});

export default connect(mapStateToProps, { getStatistic })(StarStat);

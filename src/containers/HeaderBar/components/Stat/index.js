// @flow
import React from 'react'
import { connect } from 'react-redux'

import IconButton from 'material-ui-next/IconButton'
import Tooltip from 'material-ui-next/Tooltip'
import Star from 'material-ui-icons/Star'

import { getStat } from 'src/selectors/statistic'
import { getStatistic } from 'src/actions/statistic'
import type { Props, State } from './types'

import { getStat } from 'src/selectors/statistic'
import { getStatistic } from 'src/actions/statistic'
import type { Props, State } from './types'

const Stat = (props: Props): React$Element<*> => {
  const readToday = props.stat.user_read_today || 0
  const readYear = props.stat.user_read_year || 0
  const readAllTime = props.stat.user_read || 0

  const totalRead = props.stat.total_read || 0
  const totalRead7days = props.stat.total_read_7days || 0

  const title = (
    <p>
      {'Read ('}
      <b>{'today'}</b>
      {'/year/all time): '}
      <b>{readToday}</b>
      {`/${readYear}/${readAllTime}`}
      <br />
      {`All users (7 days/all time): ${totalRead7days}/${totalRead}`}
    </p>
  )

  const handeStarClick = props.getStatistic

  return (
    <Tooltip title={title}>
      <IconButton onClick={handeStarClick}>
        <Star color={readToday > 0 ? 'blue' : null} />
      </IconButton>
    </Tooltip>
  )
}

const mapStateToProps = (state: State) => ({
  stat: getStat(state)
})

export default connect(mapStateToProps, { getStatistic })(Stat)

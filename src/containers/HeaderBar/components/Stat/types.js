// @flow
import type { Stat } from '../../../../actions/statisticTypes'

export type Props = {
  stat: Stat,
  getStatistic: () => void
}

export type State = {
  entities: {
    stat: Stat
  }
}

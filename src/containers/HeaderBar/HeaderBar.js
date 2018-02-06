import Immutable from 'immutable'
import { Component, PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import Divider from 'material-ui/Divider'
import MenuIcon from 'material-ui-icons/Menu'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import ActionSearch from 'material-ui-icons/Search'
import ContentAdd from 'material-ui-icons/Add'
import DateRange from 'material-ui-icons/DateRange'

import validUrl from 'valid-url'

import ImportModal from './../../components/ImportModal'
import ExportModal from './../../components/ExportModal'
import { REMEMBER_ARTICLES_VIEW_STATE } from './../../constants/ViewStates'
import { getAuthenticatedUser } from './../../selectors/users'
import { logoutUser } from './../../actions/users'
import styles from './HeaderBar.less'
import { rememberArticles } from './../../actions/articles'
import { isJsonString } from './../../utils/jsonUtils'
import { getViewState } from './../../selectors/view'
import { getArticles } from './../../selectors/articles'
import Stat from './components/Stat/index'

export class HeaderBar extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.Map),
    autoCompleteDataSource: PropTypes.instanceOf(Immutable.List),
    dateOrdering: PropTypes.bool,
    handleDateOrderingChange: PropTypes.func,
    logoutUser: PropTypes.func,
    rememberArticles: PropTypes.func,
    rememberArticlesState: PropTypes.instanceOf(Immutable.Map),
    searchText: PropTypes.string,
    user: PropTypes.instanceOf(Immutable.Map),
    onUpdateInput: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.bind()

    this.state = {
      articlesToImport: Immutable.fromJS([]),
      openImport: false,
      openExport: false,
      openMenu: false,
      searchOpen: false,
      saveOpen: false,
      selectedRows: [],
      url: ''
    }
  }

  getAutoCompleteDataSource() {
    return this.props.searchText.startsWith('@')
      ? this.props.autoCompleteDataSource.toJS().map(t => `@${t}`)
      : []
  }

  bind() {
    ;[
      'close',
      'handleExport',
      'handleFileUploadClick',
      'handleLogout',
      'handleOnImport',
      'handleToggle',
      'unmountModals',
      'handleTextFieldKeyDown',
      'handleRememberArticle'
    ].forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  handleToggle(val) {
    this.setState({ [val]: !this.state[val] })
  }

  close() {
    this.setState({ openMenu: false })
  }

  handleLogout() {
    this.close()
    this.props.logoutUser()
  }

  handleExport() {
    this.close()
    this.setState({ openExport: true })
  }

  handleOnImport(event) {
    const file = event.target.files[0]
    const fr = new FileReader()

    fr.onload = e => {
      const res = e.target.result

      if (isJsonString(res) && Array.isArray(JSON.parse(res))) {
        this.setState({ articlesToImport: Immutable.fromJS(JSON.parse(res)) })
      }

      this.setState({ openImport: true })
    }

    fr.readAsText(file)
  }

  unmountModals() {
    this.setState({ openImport: false })
    this.setState({ openExport: false })
  }

  handleFileUploadClick(event) {
    this.close()

    // allow to select the same file few times in a row.
    event.target.value = null
  }

  handleTextFieldKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleRememberArticle()
    }
  }

  handleRememberArticle() {
    if (validUrl.isUri(this.state.url)) {
      this.props.rememberArticles({
        articles: Immutable.fromJS({ url: this.state.url })
      })
      this.setState({ url: '' })
      this.handleToggle('saveOpen')
    }
  }

  render() {
    return (
      <div>
        <AppBar
          className={styles.headerBar}
          iconElementLeft={
            <MenuIcon color="white" style={{ margin: '0 10px 5px 30px' }} />
          }
          iconElementRight={<span />}
          iconStyleLeft={styles.iconClassNameLeft}
          iconStyleRight={{ margin: 0 }}
          title="Heutagogy"
          onLeftIconButtonTouchTap={() => this.handleToggle('openMenu')}
        >
          {this.state.searchOpen && !this.state.saveOpen ? (
            <AutoComplete
              dataSource={this.getAutoCompleteDataSource()}
              filter={AutoComplete.fuzzyFilter}
              hintText="Search"
              maxSearchResults={10}
              ref={input => input && input.focus()}
              searchText={this.props.searchText}
              onUpdateInput={this.props.onUpdateInput}
            />
          ) : null}
          {!this.state.saveOpen ? (
            <IconButton onClick={() => this.handleToggle('searchOpen')}>
              <ActionSearch />
            </IconButton>
          ) : null}
          {this.state.saveOpen && !this.state.searchOpen ? (
            <TextField
              hintText="Save url"
              ref={input => input && input.focus()}
              onBlur={this.handleRememberArticle}
              onChange={(e, url) => this.setState({ url })}
              onKeyDown={this.handleTextFieldKeyDown}
            />
          ) : null}
          {!this.state.searchOpen ? (
            <IconButton onClick={() => this.handleToggle('saveOpen')}>
              <ContentAdd />
            </IconButton>
          ) : null}
          {!this.state.searchOpen && !this.state.saveOpen ? (
            <IconButton
              iconStyle={{ height: '20px', width: '20px' }}
              onClick={this.props.handleDateOrderingChange}
            >
              <DateRange
                color={this.props.dateOrdering === true ? 'blue' : null}
              />
            </IconButton>
          ) : null}
          {!this.state.searchOpen && !this.state.saveOpen ? <Stat /> : null}
        </AppBar>
        <Drawer
          docked={false}
          open={this.state.openMenu}
          width={250}
          onRequestChange={openMenu => this.setState({ openMenu })}
        >
          <MenuItem onTouchTap={this.handleExport}>
            {'Open export modal'}
          </MenuItem>
          <MenuItem>
            {'Open import modal'}
            <input
              accept=".json"
              className={styles.input}
              id="upload"
              type="file"
              onChange={this.handleOnImport}
              onClick={this.handleFileUploadClick}
            />
          </MenuItem>
          <Divider />
          <MenuItem
            onTouchTap={this.handleLogout}
          >{`Logout (${this.props.user.get('login')})`}</MenuItem>
        </Drawer>
        <div>
          {this.state.openImport ? (
            <ImportModal
              articles={this.state.articlesToImport}
              handleUnmount={this.unmountModals}
              rememberArticles={this.props.rememberArticles}
              rememberArticlesState={this.props.rememberArticlesState}
            />
          ) : null}
          {this.state.openExport ? (
            <ExportModal
              articles={this.props.articles}
              handleUnmount={this.unmountModals}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  articles: getArticles(state),
  rememberArticlesState: getViewState(state, REMEMBER_ARTICLES_VIEW_STATE),
  user: getAuthenticatedUser(state)
})

export default connect(mapStateToProps, { logoutUser, rememberArticles })(
  HeaderBar
)

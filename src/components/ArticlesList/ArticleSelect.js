import Immutable from 'immutable'

import { Component, PropTypes } from 'react'

import TextField from 'material-ui-next/TextField'
import Paper from 'material-ui-next/Paper'
import { MenuItem } from 'material-ui-next/Menu'
import { withStyles } from 'material-ui-next/styles'

import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

const styles = _theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
})

const renderSuggestionsContainer = ({ containerProps, children, _query }) => (
  <Paper {...containerProps} children={children} />
)

const renderSuggestion = (article, { query, isHighlighted }) => {
  const matches = match(article.title, query)
  const parts = parse(article.title, matches)

  return (
    <MenuItem component="div" selected={isHighlighted}>
      <div>
        {parts.map(
          (part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ textDecoration: 'underline' }}>
                {part.text}
              </span>
            ) : (
              <span key={String(index)}>{part.text}</span>
            )
        )}
      </div>
    </MenuItem>
  )
}

const renderInputComponent = ({
  autoFocus,
  label,
  value,
  fullWidth,
  margin,
  ref,
  ...other
}) => (
  <TextField
    InputProps={{
      ...other
    }}
    autoFocus={autoFocus}
    fullWidth={fullWidth}
    inputRef={ref}
    label={label}
    margin={margin}
    value={value}
  />
)

@withStyles(styles)
export default class ArticleSelect extends Component {
  static propTypes = {
    articles: PropTypes.instanceOf(Immutable.Map).isRequired,
    classes: PropTypes.object,
    initialValue: PropTypes.string.isRequired,
    inputProps: PropTypes.object,
    onArticleSelected: PropTypes.func,
    onKeyPress: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.initialValue,
      suggestions: []
    }
  }

  getSuggestions = value =>
    this.props.articles
      .filter(article =>
        article
          .get('title')
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .toList()
      .toJS()

  getSuggestionValue = suggestion => suggestion.title

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    this.props.onArticleSelected(suggestion.id)
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    })

    this.props.onArticleSelected(null)
  }

  render() {
    const {
      classes: { container, suggestionsList, ...inputClasses }
    } = this.props

    const inputProps = {
      classes: inputClasses,
      value: this.state.value,
      onChange: this.handleChange,
      onKeyPress: this.props.onKeyPress,
      ...this.props.inputProps
    }

    return (
      <Autosuggest
        getSuggestionValue={this.getSuggestionValue}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionsContainer}
        suggestions={this.state.suggestions}
        theme={{
          container,
          suggestionsList
        }}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
      />
    )
  }
}

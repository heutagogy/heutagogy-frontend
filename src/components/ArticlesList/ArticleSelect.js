/* eslint-disable */
import { Component, PropTypes } from 'react';

import TextField from 'material-ui-next/TextField';
import Paper from 'material-ui-next/Paper';
import { MenuItem } from 'material-ui-next/Menu';
import { withStyles } from 'material-ui-next/styles';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200,
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});


const renderSuggestionsContainer = ({ containerProps, children, query }) => (
  <Paper {...containerProps} square children={children} />
);

const renderSuggestion = (article, { query, isHighlighted }) => {
  const matches = match(article.title, query);
  const parts = parse(article.title, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => (
          part.highlight
          ? (
            <span key={String(index)} style={{ textDecoration: 'underline' }}>
              {part.text}
            </span>
          ): (
            <span key={String(index)}>
              {part.text}
            </span>
          )
        ))}
      </div>
    </MenuItem>
  );
};

const renderInputComponent = ({ classes, autoFocus, label, value, fullWidth, margin, ref, ...other }) => (
  <TextField
    autoFocus={autoFocus}
    fullWidth={fullWidth}
    label={label}
    value={value}
    inputRef={ref}
    InputProps={{
      ...other,
    }}
    margin={margin}
  />
);

@withStyles(styles)
export default class ArticleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue,
      suggestions: [],
    };
  }

  getSuggestions = (value) => {
    return this.props.articles.filter((article) => article.get('title').toLowerCase().includes(value.toLowerCase())).toJS();
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.props.onArticleSelected(suggestion.id);
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });

    this.props.onArticleSelected(null);
  };

  render() {
    const { classes } = this.props;

    const inputProps = {
      classes,
      value: this.state.value,
      onChange: this.handleChange,
      ...this.props.inputProps,
    };

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsList: classes.suggestionsList,
        }}
        getSuggestionValue={(suggestion) => suggestion.title}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={renderSuggestionsContainer}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
      />
    );
  }
}

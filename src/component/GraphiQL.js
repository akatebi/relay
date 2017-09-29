import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import sizeof from 'object-sizeof';
import Scrollbar from './Scrollbar';
import { myFetch } from '../service/apiFetch';
import { graphqlServer } from '../constant/app';

class MyGraphiQL extends Component {
  // When the query and variables string is edited, update the URL bar so
  // that it can be easily shared
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const search = window.location.search;
    this.parameters = {};
    search.substr(1).split('&').forEach((entry) => {
      const eq = entry.indexOf('=');
      if (eq >= 0) {
        this.parameters[decodeURIComponent(entry.slice(0, eq))] =
          decodeURIComponent(entry.slice(eq + 1));
      }
    });
    // if variables was provided, try to format it.
    if (this.parameters.variables) {
      try {
        this.parameters.variables =
          JSON.stringify(JSON.parse(this.parameters.variables), null, 2);
      } catch (e) {
        // Do nothing, we want to display the invalid JSON as a string, rather
        // than present an error.
      }
    }
  }

  onEditQuery = (newQuery) => {
    this.parameters.query = newQuery;
    this.updateURL();
  }

  onEditVariables = (newVariables) => {
    this.parameters.variables = newVariables;
    this.updateURL();
  }

  onEditOperationName = (newOperationName) => {
    this.parameters.operationName = newOperationName;
    this.updateURL();
  }

  updateURL = () => {
    const string = Object.keys(this.parameters)
      .filter(key => Boolean(this.parameters[key]))
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.parameters[key])}`)
      .join('&');
    const newSearch = `?${string}`;
    history.replaceState(null, null, newSearch);
  }

  graphQLFetcher = (graphQLParams) => {
    const t1 = Date.now();
    return myFetch(graphqlServer, {
      method: 'post',
      body: JSON.stringify(graphQLParams),
    })
      .then(response => response.text())
      .then((responseBody) => {
        const delta = ((Date.now() - t1) / 1000).toFixed(2);
        const querySize = (sizeof(graphQLParams) / 1024).toFixed(2);
        const responeSize = (sizeof(responseBody) / 1024).toFixed(2);
        this.setState({ delta, querySize, responeSize });
        try {
          return JSON.parse(responseBody);
        } catch (error) {
          return responseBody;
        }
      })
      .catch(error => error);
  };

  render() {
    const { delta, querySize, responeSize } = this.state;
    return (
      <Scrollbar>
        <div style={{ height: 700, marginLeft: 15, marginRight: 15 }}>
          <GraphiQL
            fetcher={this.graphQLFetcher}
            query={this.parameters.query}
            variables={this.parameters.variables}
            operationName={this.parameters.operationName}
            onEditQuery={this.onEditQuery}
            onEditVariables={this.onEditVariables}
            onEditOperationName={this.onEditOperationName}
          >
            <GraphiQL.Footer>
              {`Time ${delta} Seconds, Query ${querySize}, Response ${responeSize} KiloBytes`}
            </GraphiQL.Footer>
          </GraphiQL>
        </div>
      </Scrollbar>
    );
  }

}

export default MyGraphiQL;

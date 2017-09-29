import PropTypes from 'prop-types';
import React, { Component } from 'react';
import qs from 'qs';
import moment from 'moment';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';

import { entityRevRouteMap } from '../../../share/entityRouteMaps';
import { successAlert, errorAlert } from '../../service/alert';
import { newPageMutation } from './mutation/newPage';

const debug = require('debug')('app:component:newpage:Title');

class Title extends Component {

  static propTypes = {
    documentKind: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {}

  componentWillMount() {
    let { location: { search } } = this.props;
    search = qs.parse(search, { ignoreQueryPrefix: true });
    let { title } = search;
    debug('title', title);
    title = `${title} - ${moment().format('lll')}`;
    this.setState({ title });
  }

  onMutationResponse({ newRevision: { id, flagCarrierId, entityType } }) {
    debug('onMutationResponse', flagCarrierId, entityType);
    const pathname = `/${entityRevRouteMap(entityType)}/${flagCarrierId || id}/identity`;
    const search = qs.stringify({ action: 'edit' });
    debug('pathname', pathname, search);
    this.props.history.push({ pathname, search });
  }

  createNewPage = () => {
    if (this.state.mutating) {
      debug('ignoring all button clicks while mutating');
      return;
    }
    const {
      params: { entityRoute, org, type, layout },
      relay: { environment },
      documentKind,
    } = this.props;
    const { title } = this.state;
    this.setState({ mutating: true });
    newPageMutation(
      environment,
      { entityRoute, org, type, layout, title, documentKind },
      (response) => {
        debug('onCompleted', response);
        successAlert(`"${title}" created`);
        this.onMutationResponse(response.newPageMutation);
        this.setState({ mutating: false });
      },
      (error) => {
        debug('onError', error);
        errorAlert(error.message);
        this.setState({ mutating: false });
      },
    );
  }

  render() {
    const { title } = this.state;
    const titleProps = {
      label: ' ',
      style: { textAlign: 'left', height: 36, marginLeft: 10 },
      type: 'text',
      value: title,
      onChange: evt => this.setState({ title: evt.target.value }),
    };
    return (
      <div>
        <form>
          <FormGroup
            controlId="formBasicText"
            validationState={title.length ? 'success' : 'error'}
          >
            <ControlLabel className="header-label">Title</ControlLabel>
            <FormControl {...titleProps} style={{ marginLeft: 0 }} />
            <FormControl.Feedback />
            {title.length > 0 || <HelpBlock>The Title is required</HelpBlock>}
          </FormGroup>
          <br />
          <div>
            <Button
              bsStyle="primary"
              onClick={this.createNewPage}
            >Create</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default Title;

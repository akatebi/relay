import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Popover, OverlayTrigger } from 'react-bootstrap';

// const debug = require('debug')('app:Cultures:Enabled');

class Enabled extends Component {

  static propTypes = {
    cultures: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { showDetails: false };
  }

  render() {
    const { enabled, enabledLabels } = this.props.cultures;
    const { headerLabel, message, cultureCodeLabel, nativeNameLabel } = enabledLabels;

    return (
      <div className="col-sm-4">
        <div className="enabled">
          <div className="header-label">{headerLabel}</div>

          {enabled.length > 0 || <div className="label">{message}</div>}

          {enabled.length > 0 &&
          <table className="table table-striped table-condensed table-hover">
            <tbody>
              {enabled.map((culture, index) =>
                (<tr key={index}>
                  <td>
                    <OverlayTrigger
                      rootClose
                      trigger="click"
                      placement="right"
                      overlay={<Popover id={index} title={culture.displayName}>
                        <h6>{`${nativeNameLabel}: ${culture.nativeName}`}</h6>
                        <h6>{`${cultureCodeLabel}: ${culture.cultureCode}`}</h6>
                      </Popover>}
                    >
                      <div className="link">
                        {culture.displayName}
                      </div>
                    </OverlayTrigger>
                  </td>
                </tr>),
              )}
            </tbody>
          </table>
          }
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(Enabled, {
  cultures: graphql`
    fragment Enabled_cultures on Cultures {
      enabledLabels {
        message
        headerLabel
        nativeNameLabel
        cultureCodeLabel
      }
      enabled {
        displayName
        cultureCode
        nativeName
      }
    }
  `,
});

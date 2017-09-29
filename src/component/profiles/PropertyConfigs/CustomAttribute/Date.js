import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';

// const debug = require('debug')('component:profiles:Property:DateAttr');

class DateAttr extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    customAttr: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.format = 'YYYY-MM-DDTHH:mm:ssZ';
  }

  componentWillMount() {
    const { customAttr: { value: { valueDate } } } = this.props;
    const value = moment(valueDate).format(this.format);
    this.setState({ valueDate: value });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueDate },
      },
    } = this.props;

    const dateFormat = {
      dateTime: this.state.valueVMDate,
      inputFormat: 'M/D/YYYY',
      format: this.format,
      mode: 'date',
      // size: 'lg',
      onChange: (date) => {
        if (date !== 'Invalid date') {
          // const value = moment(date).format(this.format);
          this.setState({ valueVMDate: date });
          const { customAttr: { name, type, value: { valueDate } } } = this.props;
          const value = moment.utc(date).format();
          onChange(name, type, valueDate, value);
        }
      },
    };

    return (
      <div>
        <span className="property-label">{headerLabel}: </span>
        {(action === 'edit' && isEditable) ?
          <div>
            <DateTimeField {...dateFormat} />
          </div>
          :
          <span className="value-md">
            {moment(valueDate).locale('en').format('LL')}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(DateAttr, {
  customAttr: graphql`
    fragment Date_customAttr on CustomAttribute {
      type
      name
      value {
        ... on DateAttr {
          valueDate
        }
      }
    }
  `,
});

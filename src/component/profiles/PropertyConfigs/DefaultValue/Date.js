import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';

// const debug = require('debug')('component:profiles:Property:DateProp');

class DateProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.format = 'YYYY-MM-DDTHH:mm:ssZ';
  }

  componentWillMount() {
    const { property: { defaultValue: { valueVMDate } } } = this.props;
    const value = moment(valueVMDate).format(this.format);
    this.setState({ valueVMDate: value });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMDate } },
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
          const { property: { propertyType, defaultValue: { valueVMDate: defaultValue } } } = this.props;
          const value = moment.utc(date).format();
          // debug(value, defaultValue);
          onChange(propertyType, defaultValue, value);
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
            {moment(valueVMDate).locale('en').format('LL')}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(DateProp, {
  property: graphql`
    fragment Date_property on PropertyConfig {
      propertyType
      defaultValue {
        ... on DateProp {
          valueVMDate
        }
      }
    }
  `,
});

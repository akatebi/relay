import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Label from './Label';

// const debug = require('debug')('component:profiles:Property:DateProp');

class DateProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMDate: PropTypes.string.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.format = 'YYYY-MM-DDTHH:mm:ssZ';
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMDate } } } = this.props;
    const value = moment(valueVMDate).format(this.format);
    this.setState({ valueVMDate: value });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMDate }, isEditable },
    } = this.props;

    const editMode = action === 'edit';

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
          const { propertyContent: { id, propertyType, valueVM: { valueVMDate: valueVM } } } = this.props;
          const value = moment.utc(date).format();
          // debug(value, valueVM);
          onChange({ id, propertyType, value, valueVM });
        }
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-5 leftpadding">
            <DateTimeField {...dateFormat} />
          </div> :
          <div className="col-sm-5 property-value leftpadding">
            {moment(valueVMDate).locale('en').format('LL')}
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(DateProp, {
  propertyContent: graphql`
    fragment Date_propertyContent on PropertyContent {
      id
      propertyType
      isEditable
      valueVM {
        ... on DateProp {
          valueVMDate
        }
      }
      ...Label_propertyContent
    }
  `,
});

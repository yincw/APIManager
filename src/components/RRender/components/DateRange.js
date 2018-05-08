import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export default class DateRange extends React.Component {
  state = {
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const endValue = this.props.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.props.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onStartChange = (value) => {
    var time = '';
    if(value) {
      time = value.utc().format();
    }
    this.props.onChange && this.props.onChange(time, this.props.startField || 'starttime');
  }

  onEndChange = (value) => {
    var time = '';
    if(value) {
      time = value.utc().format();
    }
    this.props.onChange && this.props.onChange(time, this.props.endField || 'endtime');
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  render() {
    const { endOpen } = this.state;
    var { startValue, endValue } = this.props;
    if(startValue)
      startValue = moment(startValue);
    
    if(endValue)
      endValue = moment(endValue);
    return (
      <div className={this.props.className}>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          placeholder="开始时间"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          placeholder="结束时间"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}

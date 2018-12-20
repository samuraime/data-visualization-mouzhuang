import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { white, cyan, pink } from '../constants/color';

// 定位基准为中轴线
export default class Label extends PureComponent {
  state = {
    trend: 0, // -1, 0, 1
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== null) {
      this.setState({
        trend: Math.sign(nextProps.value - this.props.value),
      });
    }
  }
  render() {
    const {
      label, value, dot, percent, decimal, ...other
    } = this.props;
    const { trend } = this.state;
    const textProps = {
      textAnchor: 'start',
      alignmentBaseline: 'central',
      fontSize: 14,
    };
    return (
      <g {...other}>
        {dot && <circle cx="1" cy="0" r="2" fill={cyan} />}
        <text x={10} fill={cyan} {...textProps}>
          {label}
          {value !== null &&
            <tspan fill={white} {...textProps}> {value.toFixed(decimal)}{percent && ' %'}</tspan>
          }
          {!!trend && (
            trend > 0
              ? <tspan dx="5" fill={pink} {...textProps}>↑</tspan>
              : <tspan dx="5" fill="#3046a9" {...textProps}>↓</tspan>
          )}
        </text>
      </g>
    );
  }
}

Label.defaultProps = {
  value: null,
  decimal: 0,
  dot: false,
  percent: false,
};

Label.propTypes = {
  label: PropTypes.string.isRequired,
  decimal: PropTypes.number,
  value: PropTypes.number,
  dot: PropTypes.bool,
  percent: PropTypes.bool,
};

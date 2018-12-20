/* eslint react/no-array-index-key: 0 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { white, pink } from '../constants/color';

export default class Counter extends PureComponent {
  render() {
    const { value, ...other } = this.props;
    const numbers = value.toString().padStart(4, '0').split('');
    const height = 25;
    return (
      <g {...other}>
        {numbers.map((number, i) => (
          <g key={i} transform={`translate(${20 * i}, 0)`}>
            <rect fill={pink} width={18} height={25} rx={3} ry={3} />
            <text fill={white} dx={9} y={height / 2} textAnchor="middle" alignmentBaseline="central">{number}</text>
          </g>
        ))}
      </g>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
};

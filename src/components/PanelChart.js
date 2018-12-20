/* eslint react/no-array-index-key: 0 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { black, white, blue } from '../constants/color';

// 以中心点为定位中心
export default class PanelChart extends PureComponent {
  render() {
    const { max, value, ...other } = this.props;
    const ratio = max ? value / max : 0;
    const percent = (ratio * 100).toFixed(2);
    const radius = 50;
    const innerRadius = 36;
    const dotRaidus = innerRadius - 4;
    const dotCount = 42;
    const innerCircleLength = 2 * Math.PI * innerRadius;
    return (
      <g textAnchor="middle" {...other}>
        <defs>
          {/* 这个色环只有半个 */}
          <linearGradient id="chromatic" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255, 0, 108, .5)" />
            <stop offset="100%" stopColor="rgba(255, 0, 108, 1)" />
          </linearGradient>
        </defs>
        <circle cx="0" cy="0" r={radius} fill="#0f122f" stroke="#303f81" />
        <circle
          cx="0"
          cy="0"
          r={innerRadius}
          fill="none"
          stroke="#cf2774"
          // stroke="url(#chromatic)"
          strokeWidth={(radius - innerRadius) * 2 - 2}
          strokeDasharray={`${innerCircleLength}`}
          strokeDashoffset={(ratio - 1) * innerCircleLength}
          transform="rotate(90) scale(1, -1)"
          className="panel-chart-transition"
        />
        <circle cx="0" cy="0" r={innerRadius} fill={black} />
        {Array(dotCount).fill(0).map((a, i) => {
          const radian = 2 * Math.PI / dotCount * i;
          const x = dotRaidus * Math.cos(radian);
          const y = dotRaidus * Math.sin(radian);
          const opacity = 0.2 + 0.8 * Math.abs(radian - Math.PI / 2) / Math.PI;
          return (
            <circle key={i} cx={x} cy={y} r={1} fill={`rgba(49, 68, 153, ${opacity})`} />
          );
        })}
        <text y={-14} fill={blue} fontSize="7" alignmentBaseline="central">累计评价人数</text>
        <text y={-4} fill={blue} fontSize="7" alignmentBaseline="central">占比累计支付用户数</text>
        <text y={12} fill={white} fontSize="12" alignmentBaseline="central">{percent}%</text>
      </g>
    );
  }
}

PanelChart.propTypes = {
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

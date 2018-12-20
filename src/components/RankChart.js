import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { white, pink, cyan } from '../constants/color';

export default class RankChart extends PureComponent {
  render() {
    const { list, ...other } = this.props;
    const labelWidth = 42;
    const barWidth = 132;
    const barHeight = 20;
    const color = '#1b1b3c';
    return (
      <g fontSize="12" {...other}>
        {list.map(({ id, label, value }, i) => (
          <g key={id} transform={`translate(0, ${27 * i})`}>
            <line
              x1={0}
              y1={0.5}
              x2={labelWidth}
              y2={0.5}
              stroke={color}
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={barHeight - 0.5}
              x2={labelWidth}
              y2={barHeight - 0.5}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={labelWidth}
              width={barWidth}
              height={barHeight}
              fill={color}
            />
            <rect
              className="rank-chart-transition"
              x={labelWidth}
              width={value * barWidth / 100}
              height={barHeight}
              fill={pink}
            />
            <text
              x={labelWidth / 2}
              y={barHeight / 2}
              textAnchor="middle"
              alignmentBaseline="central"
              fill={cyan}
            >
              {label}
            </text>
            <text
              x={labelWidth + barWidth - 5}
              y={barHeight / 2}
              textAnchor="end"
              alignmentBaseline="central"
              fill={white}
            >
              {value.toFixed(3)} %
            </text>
          </g>
        ))}
      </g>
    );
  }
}

RankChart.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
};

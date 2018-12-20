import React from 'react';
import PropTypes from 'prop-types';
import { darkBlue, pink } from '../constants/color';

// 定位基准为中轴线
export default function Progress({
  max, value, width, height, ...other
}) {
  const currentWidth = width * value / max;
  const radius = height / 2;
  return (
    <g {...other}>
      <rect y={-radius} width={width} height={height} fill={darkBlue} rx={radius} ry={radius} />
      <rect className="progress-transition" y={-radius} width={currentWidth} height={height} fill={pink} rx={radius} ry={radius} />
    </g>
  );
}

Progress.defaultProps = {
  max: 100,
  value: 0,
  width: 265,
  height: 7,
};

Progress.propTypes = {
  max: PropTypes.number,
  value: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

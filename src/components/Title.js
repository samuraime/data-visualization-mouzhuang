import React from 'react';
import PropTypes from 'prop-types';
import { white, pink } from '../constants/color';

// 定位基准为中轴线
export default function Title({
  children,
  ...other
}) {
  return (
    <g {...other}>
      <rect y={-3} width={6} height={6} fill={pink} />
      <text
        x={15}
        textAnchor="start"
        alignmentBaseline="central"
        fill={white}
        fontSize="14"
      >
        {children}
      </text>
    </g>
  );
}

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

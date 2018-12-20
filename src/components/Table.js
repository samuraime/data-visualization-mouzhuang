import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { black, white, cyan } from '../constants/color';

// TODO 不靠谱但是有效
const ellipsisText = (text, width, fontSize) => {
  const fontWidth = fontSize / 1.414 * 0.9;
  const avaliableWidth = width - 6;
  const string = text.toString();
  const chars = text.split('');
  const index = chars.findIndex((char, i) => {
    const sliced = chars.slice(0, i);
    const w = lodash.sum(sliced.map(c => (/[\w.]/.test(c) ? fontWidth : (fontWidth * 1.8))));
    return w > avaliableWidth;
  });
  if (index === -1 || index + 1 >= chars.length) {
    return string;
  }
  return `${string.substr(0, index - 1)}\u2026`;
};

export default class Table extends PureComponent {
  render() {
    const {
      meta, list, rows, ...other
    } = this.props;
    const offsetMap = meta.map(({ width }, i) => {
      const prev = i === 0 ? 0 : lodash.sumBy(meta.slice(0, i), 'width');
      return prev + width / 2;
    });
    const rowHeight = 30;
    const fontSize = 10;
    const totalWidth = lodash.sumBy(meta, 'width');
    const slicedList = list.slice(0, rows);
    const clipPathId = `clipPath-${totalWidth}-${rows}`;
    return (
      <g fontSize={fontSize} {...other}>
        <defs>
          <clipPath id={clipPathId}>
            <rect x={0} y={rowHeight} width={totalWidth} height={rowHeight * rows} />
          </clipPath>
        </defs>
        {slicedList.concat(0).map((a, index) => (
          meta.map(({ width }, i) => (
            <rect
              // eslint-disable-next-line
              key={`${index}-${i}`}
              x={i === 0 ? 0 : lodash.sumBy(meta.slice(0, i), 'width')}
              y={rowHeight * index}
              width={width}
              height={rowHeight}
              fill={index % 2 ? '#0b112b' : black}
              stroke="#222444"
            />
          ))
        ))}
        <text y={rowHeight / 2} fill={cyan}>
          {meta.map(({ name, label }, i) => (
            <tspan
              key={name}
              x={offsetMap[i]}
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {label}
            </tspan>
          ))}
        </text>
        <TransitionGroup component="g" clipPath={`url(#${clipPathId})`}>
          {list.map((item, index) => (
            <CSSTransition
              key={item.id}
              timeout={1000}
              classNames={{
                enter: 'table-item-enter',
                enterActive: 'table-item-enter-active',
                exit: !index ? 'table-item-exit' : 'table-item-exit no-transition',
                exitActive: !index ? 'table-item-exit-active' : 'table-item-exit-active no-transition',
              }}
            >
              <text y={rowHeight * (index + 1) + rowHeight / 2} fill={white}>
                {meta.map(({ name, width, ellipsis }, i) => (
                  <tspan
                    key={`${name}-${item.id}`}
                    x={offsetMap[i]}
                    textAnchor="middle"
                    alignmentBaseline="central"
                  >
                    {ellipsis
                      ? ellipsisText(item[meta[i].name], width, fontSize)
                      : item[meta[i].name]
                    }
                  </tspan>
                ))}
              </text>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </g>
    );
  }
}

Table.defaultProps = {
  rows: 3,
};

Table.propTypes = {
  rows: PropTypes.number,
  meta: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  })).isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  })).isRequired,
};

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import chinaMap from '../constants/china.json';
import Counter from './Counter';
import southSea from '../data/south.png';

export default class MapChart extends PureComponent {
  getColor = (id) => {
    const legends = [
      { color: '#ff006c', value: 3 },
      { color: '#4a86ff', value: 2 },
      { color: '#1f3db6', value: 1 },
      { color: '#13264f', value: 0 },
    ];
    const area = this.props.dataset.find(({ id: mid }) => id === mid);
    const areaValue = area ? area.value : 0;
    return legends.find(({ value }) => areaValue >= value || value === 0).color;
  }
  render() {
    const {
      width: totalWidth, height: totalHeight, records, dataset, ...other
    } = this.props;
    const box = {
      top: 60, right: 0, bottom: 0, left: 0,
    };
    const width = totalWidth - box.left - box.right;
    const height = totalHeight - box.top - box.bottom;
    const projection = d3.geoMercator()
      .center([104.1, 35])
      .scale(500)
      .translate([width / 2, height / 2]);
    const geoPath = d3.geoPath().projection(projection);
    const getClipPathId = id => `area-${id}`;
    return (
      <g {...other}>
        <defs>
          {chinaMap.features.map(d => (
            <clipPath key={d.properties.id} id={getClipPathId(d.properties.id)}>
              <path
                d={geoPath(d)}
                stroke="#090a19"
              />
            </clipPath>
          ))}
        </defs>
        <g
          className="title"
          transform={`translate(0, ${box.top / 2})`}
        >
          <text x={300} textAnchor="end" alignmentBaseline="central" fill="#fff">当前实时回传记录数：</text>
          <Counter value={records} transform="translate(300, -12.5)" />
        </g>
        <g className="map" transform={`translate(0, ${box.top})`}>
          {chinaMap.features.map((d) => {
            const { properties } = d;
            const [cx, cy] = projection(properties.cp);
            const exists = !!dataset.find(({ id }) => id === properties.id);
            return (
              <g key={properties.id}>
                <path
                  d={geoPath(d)}
                  fill="#13264f"
                  stroke="#090a19"
                />
                {}
                {exists &&
                  <circle
                    key={dataset.length ? dataset[0].key : ''}
                    className="map-circle-animation"
                    clipPath={`url(#${getClipPathId(properties.id)})`}
                    cx={cx}
                    cy={cy}
                    fill={this.getColor(properties.id)}
                  />
                }
              </g>
            );
          })}
          <image href={southSea} x={width - 100} y={height - 140} width={80} height={120} />
          <rect x={width - 100} y={height - 140} width={80} height={120} fill="none" stroke="#1e203c" />
        </g>
      </g>
    );
  }
}

MapChart.defaultProps = {
  width: 540,
  height: 505,
  records: 0,
};

MapChart.propTypes = {
  dataset: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    id: PropTypes.string,
    value: PropTypes.number.isRequired,
  })).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  records: PropTypes.number,
};

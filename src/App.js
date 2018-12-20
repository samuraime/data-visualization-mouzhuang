/* eslint object-curly-newline: 0 */

import React, { Component } from 'react';
import MapChart from './components/MapChart';
import Title from './components/Title';
import Label from './components/Label';
import Progress from './components/Progress';
import PanelChart from './components/PanelChart';
import RankChart from './components/RankChart';
import Table from './components/Table';
import dataSource from './data/source';
import './App.css';

class App extends Component {
  state = {
    recordCount: 0,
    reviewsCount: 0,
    onlineCount: 0,
    returnRatio: 0,
    complaintRatio: 0,
    reviews: [],
    orders: [],
    returns: [],
    ranks: [],
    areas: [],
  }
  componentDidMount() {
    this.dataSource = dataSource;
    this.dataSource.subscribe((state) => {
      this.setState(state);
    });
  }
  componentWillUnmount() {
    this.dataSource.unsubscribe();
  }
  render() {
    const width = 1250;
    const height = 570;
    const headerHeight = 64;
    const {
      recordCount, reviewsCount, onlineCount, returnRatio, complaintRatio,
      reviews, orders, ranks, areas, returns,
    } = this.state;
    return (
      <svg className="app" viewBox={`0 0 ${width} ${height}`}>
        <g>
          <text x={width / 2} y="32" textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize="28">
            某妆数据交换平台
          </text>
          <line x1={0} y1={headerHeight + 1} x2={width} y2={headerHeight + 1} stroke="#161432" />
        </g>
        <g
          className="main"
          transform={`translate(0, ${headerHeight})`}
        >
          <g className="day">
            <g transform="translate(35, 35)">
              <Title>当天实时用户评价 / CUSTOMER REVIEWS</Title>
              <PanelChart
                max={100}
                value={reviewsCount}
                transform="translate(65, 80)"
              />
              <Label
                label="当前实时在线人数："
                value={onlineCount}
                dot
                transform="translate(135, 80)"
              />
              <Table
                meta={[
                  { name: 'userName', label: '用户名', width: 55 },
                  { name: 'itemName', label: '商品名', width: 60, ellipsis: true },
                  { name: 'date', label: '评价时间', width: 60 },
                  { name: 'text', label: '评价内容', width: 140, ellipsis: true },
                ]}
                list={reviews}
                transform="translate(0, 150)"
              />
              <Title transform="translate(0, 300)">当天实时支付订单 / PAYMENT</Title>
              <Table
                meta={[
                  { name: 'orderId', label: '订单号', width: 120 },
                  { name: 'itemName', label: '商品名', width: 80, ellipsis: true },
                  { name: 'userName', label: '购买人', width: 55 },
                  { name: 'date', label: '购买时间', width: 60 },
                ]}
                list={orders}
                transform="translate(0, 325)"
              />
            </g>
          </g>
          <MapChart
            className="map-chart"
            dataset={areas}
            width={550}
            height={505}
            records={recordCount}
            transform={`translate(${(width - 550) / 2}, 0)`}
          />
          <g className="month">
            <g transform="translate(917, 35)">
              <Title>当月实时退货情况 / RETURN SITUATION</Title>
              <Label
                label="全网退货率："
                value={returnRatio}
                decimal={3}
                dot
                percent
                transform="translate(8, 30)"
              />
              <Progress value={returnRatio} transform="translate(18, 50)" />
              <Label
                label="退货品类排行："
                dot
                transform="translate(8, 80)"
              />
              <RankChart
                list={ranks}
                transform="translate(20, 95)"
              />
              <Title transform="translate(0, 230)">当月实时投诉情况 / COMPLAINT SITUATION</Title>
              <Label
                label="全网投诉率："
                value={complaintRatio}
                decimal={3}
                dot
                percent
                transform="translate(8, 260)"
              />
              <Progress value={complaintRatio} transform="translate(18, 280)" />
              <Label
                label="全网退货商品"
                dot
                transform="translate(8, 310)"
              />
              <Table
                meta={[
                  { name: 'orderId', label: '订单号', width: 120 },
                  { name: 'itemName', label: '商品名', width: 100, ellipsis: true },
                  { name: 'userName', label: '购买人', width: 70 },
                ]}
                list={returns}
                transform="translate(8, 330)"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default App;

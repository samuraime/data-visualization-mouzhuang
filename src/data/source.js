import Rx from 'rxjs/Rx';
import lodash from 'lodash';
import { random, formatDate } from '../utils';
import returnsPool from './returns.json';
import reviewsPool from './reviews.json';
import ordersPool from './orders.json';
import areasPool from './areas.json';

const limit = (value, min, max) => {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
};

const initialState = {
  recordCount: 0,
  reviewsCount: 0.85,
  onlineCount: 0,
  returnRatio: 0,
  complaintRatio: 0,
  reviews: [],
  orders: [],
  returns: [],
  ranks: [
    { id: 1, label: '彩妆类', value: 0 },
    { id: 2, label: '护肤类', value: 0 },
    { id: 3, label: '个护类', value: 0 },
    { id: 4, label: '香水类', value: 0 },
  ],
  areas: [],
};

const source = new Rx.BehaviorSubject(initialState);

const delay = (fn, time = 0, repeat = false) => {
  const timeFn = repeat ? setInterval : setTimeout;
  timeFn(() => {
    const next = fn(source.getValue());
    source.next(next);
  }, time);
};

const getRanks = (ranks) => {
  // 这四个分类之和接近100即可, 还有其他分类
  const rankStandards = [58.768, 30.583, 7.349, 2.425];
  return ranks.map((item, i) => ({
    ...item,
    value: rankStandards[i] + random(-0.005, 0.005),
  }));
};

const getAreas = (count) => {
  // key与动画执行有关
  const key = Date.now();
  const areas = areasPool.map(({ id, range }) => ({
    key,
    id,
    value: random(...range),
  }));
  const areasSum = lodash.sumBy(areas, 'value');
  const withValues = areas.map((item) => {
    const v = count * item.value / areasSum;
    return {
      ...item,
      origin: v,
      value: Math.ceil(v),
    };
  });
  const sorted = lodash.reverse(lodash.sortBy(withValues, 'origin'));
  const sliceIndex = sorted.findIndex((v, index) => lodash.sumBy(sorted.slice(0, index + 1), 'value') >= count);
  return sorted.slice(0, sliceIndex);
};

const asteriskOrder = string => string.replace(/^(\d{7})\d+(\d{7})$/, '$1*****$2');

const asteriskName = string => string.replace(/^(\S).*(\S)$/, '$1***$2');

const generate = (() => {
  const meta = {
    reviews: {
      index: 0,
      pool: reviewsPool,
    },
    returns: {
      index: 0,
      pool: returnsPool,
    },
    orders: {
      index: 0,
      pool: ordersPool,
    },
  };
  const date = formatDate();
  const getItems = (key, count = 3) => {
    const { index, pool } = meta[key];
    const start = index + count >= pool.length ? 0 : index;
    const end = start + count;
    meta[key].index = end;

    return pool.slice(start, end).map(item => ({
      ...item,
      date,
      orderId: item.orderId && asteriskOrder(item.orderId),
      userName: item.userName && asteriskName(item.userName),
    }));
  };
  return (current) => {
    const recordCount = Math.floor(random(3, 20));

    return {
      ...current,
      areas: getAreas(Math.floor(recordCount / 3)),
      reviews: getItems('reviews'),
      orders: getItems('orders'),
      returns: getItems('returns'),
      ranks: getRanks(current.ranks),
      recordCount,
      reviewsCount: limit(current.reviewsCount + random(-0.005, 0.005), 0.83, 0.88),
      onlineCount: Math.floor(random(800, 1200)),
      returnRatio: limit(3.465 + random(-0.0008, 0.0008), 3.4, 3.5),
      complaintRatio: limit(1.435 + random(-0.0008, 0.0008), 1.4, 1.5),
    };
  };
})();

delay(generate);
delay(generate, 3000, true);

export default source;

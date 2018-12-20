import moment from 'moment';

export const formatDate = date => moment(date).format('YYYY/M/D');

/**
 * 将区间的值映射到目标区间
 */
export const map = (value, start, end, targetStart, targetEnd) => {
  if (value < start || value > end) {
    throw new RangeError();
  }
  return (value - start) / (end - start) * (targetEnd - targetStart) + targetStart;
};

export const random = (min, max) => map(Math.random(), 0, 1, min, max);

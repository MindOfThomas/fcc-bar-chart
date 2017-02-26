const data = require('./data.json');
const dates = data.data.map((val) => val[0]);
const values = data.data.map((val) => val[1]);

module.exports = {
  margins: {
    bottom: 50,
    left: 50
  },
  chart: {
    height: 350,
    width: null,
    lines: []
  },
  bar: {
    width: 2
  },
  dates: dates,
  values: values,
  maxValue: Math.max(...values)
};

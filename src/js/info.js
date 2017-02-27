const data = require('./data.json');

// extract dates from first index of each data.data
const dates = data.data.map((val) => val[0]);

// extract values from second index of each data.data
const values = data.data.map((val) => val[1]);

module.exports = {
  margins: {
    bottom: 50,
    left: 100
  },
  chart: {
    height: 350,
    width: null,
    linesX: [],
    linesY: []
  },
  bar: {
    width: 2
  },
  dates: dates,
  values: values,
  maxValue: Math.max(...values) // gets the highest value in values
};

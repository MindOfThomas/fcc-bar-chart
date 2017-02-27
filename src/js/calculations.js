const info = require('./info.js');

const moment = require('moment');

module.exports = {
  chartAdjWidth: function chartAdjWidth() {
    // get chart width by multiplying bar width by the number of data items
    // then add horizontal margins
    return info.margins.left + (info.bar.width * info.values.length);
  },
  chartAdjHeight: function chartAdjHeight() {
    // add vetical margins to chart height
    return info.chart.height + info.margins.bottom;
  },
  barX: function barX(value, index) {
    // index * bar width will get the x position, then add horizontal margins
    return info.margins.left + (index * info.bar.width);
  },
  adjY: function adjY(value) {
    /*
      normally you would make the percent = value / info.maxValue
      this would cause the info.maxValue to touch the top of the graph
      the last item in chartLines should be a value slightly higher than info.maxValue
      so divide value by the slightly higher info.maxValue so that info.maxValue will be
        noticeably below the top of the graph
    */
    let percent = value / info.chart.linesY[info.chart.linesY.length - 1];

    // multiply percent (currently a decimal) by chartHeight to get a height relative to chartHeight
    return percent * info.chart.height;
  },
  generateLinesX: function generateLinesX() {
    let lines = [];

    let yearsDup = info.dates.map((val) => moment(val).year()); //make an array of years
    let years = yearsDup.filter((val, i, arr) => arr.indexOf(val) === i); // remove duplicate years

    let step = 5; // cheating here, already know what the step should be

    // loop through the total number of lines (step * Math.ceil(years.length))
    // add step to year each loop, starting at 1950
    for (var year = 1950; year <= years[years.length - 1]; year += step) {

      // get the x-position using the index of this year in the info.dates array
      let x = this.barX(null, yearsDup.indexOf(year));

      lines.push({x, year});
    }

    return lines; // array of objects containing x-position and year for each line
  },
  generateLinesY: function generateLinesY(desiredNumberOfLines) {
    // get an adjusted info.maxValue (110% of info.maxValue)
    let chartMax = info.maxValue + (info.maxValue * 0.1);
    let lines = [];

    let step = chartMax / desiredNumberOfLines;
    for(var i = 0; i < desiredNumberOfLines; i++) {
      // add step to last line, or make step the valuue of first line
      let thisStep = lines[i - 1] !== undefined ? lines[i - 1] + step : step;
      lines.push(Math.ceil(thisStep));
    }

    return lines;
  }
};

let barWidth;
let chartHeight;
let margins;
let data;
let maxValue;
let chartLines;

module.exports = {
  init: function(bWidth, cHeight, margs, d, maxV) {
    barWidth = bWidth;
    chartHeight = cHeight;
    margins = margs;
    data = d;
    maxValue = maxV;
  },
  chartAdjWidth: function() {
    return margins.left + (barWidth * data.length);
  },
  chartAdjHeight: function() {
    return chartHeight + margins.bottom;
  },
  barX: function(value, index) {
    return margins.left + (index * barWidth);
  },
  adjY: function(value) {
    /*
      normally you would make the percent = value / maxValue
      this would cause the maxValue to touch the top of the graph
      the last item in chartLines should be a value slightly higher than maxValue
      so divide value by the slightly higher maxValue so that maxValue will be
        noticeably below the top of the graph
    */
    let percent = value / chartLines[chartLines.length - 1];

    // multiply percent (currently a decimal) by chartHeight to get a height relative to chartHeight
    return percent * chartHeight;
  },
  generateLineNums: function(desiredNumberOfLines) {
    // get an adjusted maxValue (110% of maxValue)
    let chartMax = maxValue + (maxValue * 0.1);
    let lines = [];

    let step = chartMax / desiredNumberOfLines;
    for(var i = 0; i < desiredNumberOfLines; i++) {
      // add step to last line, or make step the valuue of first line
      let thisStep = lines[i - 1] !== undefined ? lines[i - 1] + step : step;
      lines.push(Math.ceil(thisStep));
    }

    chartLines = lines;

    return lines;
  }
}

const barWidth = 2;
const chartHeight = 350;
const margins = {bottom: 50, left: 50};

const d3 = require('d3');
const numeral = require('numeral');
const tooltip = require('./tooltip.js');
const data = require('./data.json');

const dates = data.data.map((val) => val[0]);
const values = data.data.map((val) => val[1]);
const maxValue = Math.max(...values);
const chartLines = generateLineNums(5);

numeral.register('locale', 'en-capital', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'K',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    ordinal: function(e) {
      var t = e % 10;
      return~~ (e % 100 / 10) === 1 ? 'th' : t === 1 ? 'st' : t === 2 ? 'nd' : t === 3 ? 'rd' : 'th'
    },
    currency: {
      symbol: '$'
    }
});
numeral.locale('en-capital');

document.addEventListener('DOMContentLoaded', function() {
  // init tooltip, which will create a hidden div#tooltip
  tooltip.add();

  let svg = d3.select('#graph-container')
              .append('svg')
              .attr('id', 'graph')
              .attr('width', getChartWidth())
              .attr('height', chartHeight + margins.bottom);

  // add a g to group our rects
  let g = svg.selectAll('g')
             .data(values)
             .enter()
             .append('g')
             .attr('width', barWidth)
             .attr('height', chartHeight)
             .attr('x', getBarX)
             .attr('y', 0)
             .on('mouseover', function(d) {
               let money = d * 1000000000; // convert to billions
               money = numeral(money).format('$0.00a');
               tooltip.mouseoverHandler(money);
             })
             .on('mousemove', tooltip.mousemoveHandler)
             .on('mouseout', tooltip.mouseoutHandler);

  // add background rect for aesthetics
  drawBar(
    g,             // elementToAppendTo
    barWidth,      // width
    chartHeight,   // height
    'background',  // class
    getBarX,       // x
    0              // y
  );

  // add a rect to represent the value
  drawBar(
    g,
    barWidth,
    getAdjustedY,
    'bar',
    getBarX,
    (d) => chartHeight - getAdjustedY(d)
  );

  // add a foreground rect that will be transparent unless the user is hovering on it
  // this way the entire column will highlight on hover
  drawBar(
    g,
    barWidth,
    chartHeight,
    'foreground',
    getBarX,
    0
  );

  // add x-axis label
  drawLabel(
    svg,                           // elementToAppendTo
    getChartWidth() / 2,           // x
    chartHeight + margins.bottom,  // y
    'Time'                         // text
  );

  // add y-axis label
  drawLabel(
    svg,
    '-' + (chartHeight / 2),  // x (but acting as y because this label is rotated -90deg)
    margins.bottom / 2,       // y (but acting as x because this label is rotated -90deg)
    'Value',
    'rotate(-90)'             // transform property
  );

  drawLines(svg);
});

function getChartWidth() {
  return margins.left + (barWidth * values.length);
}

function getBarX(d, i) {
  return margins.left + (i * barWidth);
}

function getAdjustedY(thisValue) {
  /*
    normally you would make the percent = thisValue / maxValue
    this would cause the maxValue to touch the top of the graph
    the last item in chartLines should be a value slightly higher than maxValue
    so divide thisValue by the slightly higher maxValue so that maxValue will be
      noticeably below the top of the graph
  */
  let percent = thisValue / chartLines[chartLines.length - 1];

  // multiply percent (currently a decimal) by chartHeight to get a height relative to chartHeight
  return percent * chartHeight;
}

function drawBar(elementToAppendTo, width, height, className, x, y) {
  elementToAppendTo.append('rect')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('class', className)
                   .attr('x', x)
                   .attr('y', y);
}

function drawLabel(elementToAppendTo, x, y, text, transform) {
  let label = elementToAppendTo.append('text')
                               .attr('class', 'label')
                               .attr('text-anchor', 'middle')
                               .attr('x', x)
                               .attr('y', y)
                               .text(text);
  if (transform) {
    label.attr('transform', transform);
  }
}

function generateLineNums(desiredNumberOfLines) {
  // get an adjusted maxValue (110% of maxValue)
  let chartMax = maxValue + (maxValue * 0.1);
  let lines = [];

  let step = chartMax / desiredNumberOfLines;
  for(var i = 0; i < desiredNumberOfLines; i++) {
    // add step to last line, or make step the valuue of first line
    let thisStep = lines[i - 1] !== undefined ? lines[i - 1] + step : step;
    lines.push(Math.ceil(thisStep));
  }

  return lines;
}

function drawLines(elementToAppendTo) {
  for (var i = 0; i < chartLines.length; i++) {
    let lineValue = chartLines[i];
    let y = getAdjustedY(lineValue);

    // if this line's y coord is at or above the chart's height then don't draw this line
    if (y >= chartHeight) continue;

    drawLine(
      elementToAppendTo,    // elementToAppendTo
      margins.left * 0.8,   // x1 (don't draw the line all the way through the margin)
      y,                    // y1
      getChartWidth(),      // x2
      y                     // y2
    );
  }

  // add x-axis line
  let xaxisY = chartHeight + margins.bottom * 0.07;
  let xaxisX1 = margins.left * 0.95;
  let xaxisX2 = getChartWidth();
  drawLine(
    elementToAppendTo,  // elementToAppendTo
    xaxisX1,            // x1
    xaxisY,             // y1
    xaxisX2,            // x2
    xaxisY              // y2
  );

  // add y-axis line
  let yaxisX = margins.left * 0.95; // don't draw the line all the way through the margin
  drawLine(
    elementToAppendTo,  // elementToAppendTo
    yaxisX,             // x1
    0,                  // y1
    yaxisX,             // x2
    chartHeight         // y2
  );
}

function drawLine(elementToAppendTo, x1, y1, x2, y2) {
  elementToAppendTo.append('line')
                   .attr('x1', x1)
                   .attr('y1', y1)
                   .attr('x2', x2)
                   .attr('y2', y2);
}

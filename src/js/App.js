const info = require('./info.js');
const calc = require('./calculations.js');
info.chart.lines = calc.generateLineNums(5);

const d3 = require('d3');
const numeral = require('numeral');
const tooltip = require('./tooltip.js');

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
              .attr('width', calc.chartAdjWidth())
              .attr('height', calc.chartAdjHeight());

  // add a g to group our rects
  let g = svg.selectAll('g')
             .data(info.values)
             .enter()
             .append('g')
             .attr('width', info.bar.width)
             .attr('height', info.chart.height)
             .attr('x', calc.barX)
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
    g,                  // elementToAppendTo
    info.bar.width,     // width
    info.chart.height,  // height
    'background',       // class
    calc.barX,          // x
    0                   // y
  );

  // add a rect to represent the value
  drawBar(
    g,
    info.bar.width,
    calc.adjY,
    'bar',
    calc.barX,
    (d) => info.chart.height - calc.adjY(d)
  );

  // add a foreground rect that will be transparent unless the user is hovering on it
  // this way the entire column will highlight on hover
  drawBar(
    g,
    info.bar.width,
    info.chart.height,
    'foreground',
    calc.barX,
    0
  );

  // add x-axis label
  drawLabel(
    svg,                       // elementToAppendTo
    calc.chartAdjWidth() / 2,  // x
    calc.chartAdjHeight(),     // y
    'Time'                     // text
  );

  // add y-axis label
  drawLabel(
    svg,
    '-' + (info.chart.height / 2),  // x (but acting as y because this label is rotated -90deg)
    info.margins.bottom / 2,       // y (but acting as x because this label is rotated -90deg)
    'Value',
    'rotate(-90)'             // transform property
  );

  drawLines(svg);
});

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

function drawLines(elementToAppendTo) {
  for (var i = 0; i < info.chart.lines.length; i++) {
    let lineValue = info.chart.lines[i];
    let y = calc.adjY(lineValue);

    // if this line's y coord is at or above the chart's height then don't draw this line
    if (y >= info.chart.height) continue;

    drawLine(
      elementToAppendTo,   // elementToAppendTo
      info.margins.left * 0.8,  // x1 (don't draw the line all the way through the margin)
      y,                   // y1
      calc.chartAdjWidth(),   // x2
      y                    // y2
    );
  }

  // add x-axis line
  let xaxisY = info.chart.height;
  let xaxisX1 = info.margins.left;
  let xaxisX2 = calc.chartAdjWidth();
  drawLine(
    elementToAppendTo,  // elementToAppendTo
    xaxisX1,            // x1
    xaxisY,             // y1
    xaxisX2,            // x2
    xaxisY,             // y2
    'axis'
  );

  // add y-axis line
  let yaxisX = info.margins.left; // don't draw the line all the way through the margin
  drawLine(
    elementToAppendTo,  // elementToAppendTo
    yaxisX,             // x1
    0,                  // y1
    yaxisX,             // x2
    info.chart.height,        // y2
    'axis'
  );
}

function drawLine(elementToAppendTo, x1, y1, x2, y2, className) {
  className = className || '';
  elementToAppendTo.append('line')
                   .attr('x1', x1)
                   .attr('y1', y1)
                   .attr('x2', x2)
                   .attr('y2', y2)
                   .attr('class', className);
}

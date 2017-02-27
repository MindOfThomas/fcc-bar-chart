const info = require('./info.js');
const calc = require('./calculations.js');
const tooltip = require('./tooltip.js');

const d3 = require('d3');
const numeral = require('numeral');

module.exports = {
  svg: function() {
    // init tooltip, which will create a hidden div#tooltip
    tooltip.add();

    return d3.select('#graph-container')
              .append('svg')
              .attr('id', 'graph')
              .attr('width', calc.chartAdjWidth())
              .attr('height', calc.chartAdjHeight());
  },
  group: function(elementToAppendTo) {
    return  elementToAppendTo.selectAll('g')
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
  },
  bar: function(elementToAppendTo, width, height, className, x, y) {
    elementToAppendTo.append('rect')
                     .attr('width', width)
                     .attr('height', height)
                     .attr('class', className)
                     .attr('x', x)
                     .attr('y', y);
  },
  label: function(elementToAppendTo, x, y, text, transform, anchor, alignmentBaseline, className) {
    let label = elementToAppendTo.append('text')
                                 .attr('class', className || 'label')
                                 .attr('text-anchor', anchor || 'middle')
                                 .attr('x', x)
                                 .attr('y', y)
                                 .text(text);
    if (transform) {
      label.attr('transform', transform);
    }
    if (alignmentBaseline) {
      label.attr('alignment-baseline', alignmentBaseline);
    }
  },
  lines: function(elementToAppendTo) {
    for (var i = 0; i < info.chart.lines.length; i++) {
      let lineValue = info.chart.lines[i];
      let y = info.chart.height - calc.adjY(lineValue);

      // if this line's y coord is at or above the chart's height then don't draw this line
      if (y >= info.chart.height || y <= 0) continue;

      this.line(
        elementToAppendTo,        // elementToAppendTo
        info.margins.left * 0.8,  // x1 (don't draw the line all the way through the margin)
        y,                        // y1
        calc.chartAdjWidth(),     // x2
        y                         // y2
      );
    }

    // add x-axis line
    let xaxisY = info.chart.height;
    let xaxisX1 = info.margins.left;
    let xaxisX2 = calc.chartAdjWidth();
    this.line(
      elementToAppendTo,  // elementToAppendTo
      xaxisX1,            // x1
      xaxisY,             // y1
      xaxisX2,            // x2
      xaxisY,             // y2
      'axis'
    );

    // add y-axis line
    let yaxisX = info.margins.left; // don't draw the line all the way through the margin
    this.line(
      elementToAppendTo,  // elementToAppendTo
      yaxisX,             // x1
      0,                  // y1
      yaxisX,             // x2
      info.chart.height,        // y2
      'axis'
    );
  },
  lineLabels: function(elementToAppendTo) {
    for (var i = 0; i < info.chart.lines.length; i++) {
      let lineValue = info.chart.lines[i];
      let y = info.chart.height - calc.adjY(lineValue);

      // if this line's y coord is at or above the chart's height then don't draw this label
      if (y >= info.chart.height || y <= 0) continue;

      lineValue *= 1000000000; // convert to billions
      this.label(
        elementToAppendTo,                    // elementToAppendTo
        info.margins.left * 0.8,              // x (don't draw the line all the way through the margin)
        y,                                    // y
        numeral(lineValue).format('$0.00a'),  // text
        '',                                   // transform (don't need to transform)
        'end',                                // text-anchor
        'middle',                             // alignment-baseline
        'axis-label'
      );
    }
  },
  line: function(elementToAppendTo, x1, y1, x2, y2, className) {
    className = className || '';
    elementToAppendTo.append('line')
                     .attr('x1', x1)
                     .attr('y1', y1)
                     .attr('x2', x2)
                     .attr('y2', y2)
                     .attr('class', className);
  }
}

const info = require('./info.js');
const calc = require('./calculations.js');
const tooltip = require('./tooltip.js');

const d3 = require('d3');
const numeral = require('numeral');

module.exports = {
  svg: function svg() {
    // init tooltip, which will create a hidden div#tooltip
    tooltip.add();

    return d3.select('#graph-container')
              .append('svg')
              .attr('id', 'graph')
              .attr('width', calc.chartAdjWidth())
              .attr('height', calc.chartAdjHeight());
  },
  group: function group(elementToAppendTo) {
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
  bar: function bar(elementToAppendTo, width, height, className, x, y) {
    elementToAppendTo.append('rect')
                     .attr('width', width)
                     .attr('height', height)
                     .attr('class', className)
                     .attr('x', x)
                     .attr('y', y);
  },
  label: function label(elementToAppendTo, x, y, text, transform, anchor, alignmentBaseline, className) {
    let labelEl = elementToAppendTo.append('text')
                                   .attr('class', className || 'label')
                                   .attr('text-anchor', anchor || 'middle')
                                   .attr('x', x)
                                   .attr('y', y)
                                   .text(text);
    if (transform) {
      labelEl.attr('transform', transform);
    }
    if (alignmentBaseline) {
      labelEl.attr('alignment-baseline', alignmentBaseline);
    }
  },
  line: function line(elementToAppendTo, x1, y1, x2, y2, className) {
    className = className || '';
    elementToAppendTo.append('line')
                     .attr('x1', x1)
                     .attr('y1', y1)
                     .attr('x2', x2)
                     .attr('y2', y2)
                     .attr('class', className);
  }
}

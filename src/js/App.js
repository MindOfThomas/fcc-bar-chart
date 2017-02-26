const info = require('./info.js');
const draw = require('./draw.js');
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
  draw.bar(
    g,                  // elementToAppendTo
    info.bar.width,     // width
    info.chart.height,  // height
    'background',       // class
    calc.barX,          // x
    0                   // y
  );

  // add a rect to represent the value
  draw.bar(
    g,
    info.bar.width,
    calc.adjY,
    'bar',
    calc.barX,
    (d) => info.chart.height - calc.adjY(d)
  );

  // add a foreground rect that will be transparent unless the user is hovering on it
  // this way the entire column will highlight on hover
  draw.bar(
    g,
    info.bar.width,
    info.chart.height,
    'foreground',
    calc.barX,
    0
  );

  // add x-axis label
  draw.label(
    svg,                       // elementToAppendTo
    calc.chartAdjWidth() / 2,  // x
    calc.chartAdjHeight(),     // y
    'Time'                     // text
  );

  // add y-axis label
  draw.label(
    svg,
    '-' + (info.chart.height / 2),  // x (but acting as y because this label is rotated -90deg)
    info.margins.bottom / 2,       // y (but acting as x because this label is rotated -90deg)
    'Value',
    'rotate(-90)'             // transform property
  );

  draw.lines(svg);
});

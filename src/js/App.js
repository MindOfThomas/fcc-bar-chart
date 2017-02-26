const barWidth = 2;
const chartHeight = 350;
const margins = {bottom: 25, left: 25};

const d3 = require('d3');
const numeral = require('numeral');
const tooltip = require('./tooltip.js');
const data = require('./data.json');

const dates = data.data.map((val) => val[0]);
const values = data.data.map((val) => val[1]);
const maxValue = Math.max(...values);

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
              .attr('width', margins.left + (values.length * barWidth))
              .attr('height', chartHeight + margins.bottom);

  // add x-axis label
  svg.append('text')
     .attr('class', 'label')
     .attr('text-anchor', 'middle')
     .attr('x', margins.left + (barWidth * values.length) / 2)
     .attr('y', chartHeight + margins.bottom)
     .text('Time');

  // add y-axis label
  svg.append('text')
     .attr('class', 'label')
     .attr('text-anchor', 'start')
     .attr('x', '-' + (chartHeight / 2)) // x and y are flipped because of the rotation
     .attr('y', margins.bottom / 2) // this might not always put the label within the chart's bounds
     .attr('transform', 'rotate(-90)')
     .text('Value');


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
  drawBar(g, barWidth, chartHeight, 'bg', getBarX, 0);

  // add a rect to represent the value
  drawBar(g, barWidth, getBarHeight, 'bar', getBarX, (d) => chartHeight - getBarHeight(d));

  // add a foreground rect that will be transparent unless the user is hovering on it
  // this way the entire column will highlight
  drawBar(g, barWidth, chartHeight, 'fg', getBarX, 0);
});

function getBarX(d, i) {
  return margins.left + (i * barWidth);
}
function getBarHeight(d) {
  return (d / maxValue) * chartHeight;
}

function drawBar(elementToAppendTo, width, height, className, x, y) {
  elementToAppendTo.append('rect')
                   .attr('width', width)
                   .attr('height', height)
                   .attr('class', className)
                   .attr('x', x)
                   .attr('y', y);
}

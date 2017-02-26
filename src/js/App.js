const barWidth = 3;
const chartHeight = 100;

const d3 = require('d3');
const tooltip = require('./tooltip.js');
const data = require('./data.json');

const dates = data.data.map((val) => val[0]);
const values = data.data.map((val) => val[1]);
const maxValue = Math.max(...values);

document.addEventListener('DOMContentLoaded', function() {
  // init tooltip, which will create a hidden div#tooltip
  tooltip.add();

  let svg = d3.select('#graph-container')
              .append('svg')
              .attr('id', 'graph')
              .attr('width', values.length * barWidth)
              .selectAll('g')
              .data(values)
              .enter();

  // add a g to group our rects
  let g = svg.append('g')
             .attr('width', barWidth)
             .attr('height', chartHeight)
             .attr('x', (d, i) => i * barWidth)
             .attr('y', 0)
             .on('mouseover', tooltip.mouseoverHandler)
             .on('mousemove', tooltip.mousemoveHandler)
             .on('mouseout', tooltip.mouseoutHandler);

  // add background rect for aesthetics
  g.append('rect')
   .attr('width', barWidth)
   .attr('height', chartHeight)
   .attr('class', 'bg')
   .attr('x', (d, i) => i * barWidth)

  // add a rect to represent the value
  g.append('rect')
   .attr('class', 'bar')
   .attr('width', barWidth)
   .attr('height', (d) => (d / maxValue) * chartHeight)
   .attr('x', (d, i) => i * barWidth)
   .attr('y', (d) => chartHeight - ((d / maxValue) * chartHeight))

  // add a foreground rect that will be transparent unless the user is hovering on it
  // this way the entire column will highlight
  g.append('rect')
   .attr('width', barWidth)
   .attr('height', chartHeight)
   .attr('class', 'fg')
   .attr('x', (d, i) => i * barWidth)
});

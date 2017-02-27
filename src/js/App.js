const info = require('./info.js');
const draw = require('./draw.js');
const calc = require('./calculations.js');
info.chart.lines = calc.generateLineNums(5);

const d3 = require('d3');

const numeral = require('numeral');
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
  let svg = draw.svg();

  // GROUP
  let g = draw.group(svg);

  // BACKGROUND RECT
  draw.bar(
    g,                  // elementToAppendTo
    info.bar.width,     // width
    info.chart.height,  // height
    'background',       // class
    calc.barX,          // x
    0                   // y
  );

  // VALUE RECT
  draw.bar(
    g,
    info.bar.width,
    calc.adjY,
    'bar',
    calc.barX,
    (d) => info.chart.height - calc.adjY(d)
  );

  // FOREGROUND RECT
  // rect will be transparent unless the user is hovering on it
  // this way the entire column will highlight on hover
  draw.bar(
    g,
    info.bar.width,
    info.chart.height,
    'foreground',
    calc.barX,
    0
  );

  // X-AXIS LABEL
  draw.label(
    svg,                       // elementToAppendTo
    calc.chartAdjWidth() / 2,  // x
    calc.chartAdjHeight(),     // y
    'Time',                    // text
    '',
    'start'
  );

  // Y-AXIS LABEL
  draw.label(
    svg,
    '-' + (info.chart.height / 2),  // x (but acting as y because this label is rotated -90deg)
    info.margins.bottom / 2,        // y (but acting as x because this label is rotated -90deg)
    'Value',
    'rotate(-90)'                   // transform property
  );

  // BEGIN DRAWING LINES
  for (var i = 0; i < info.chart.lines.length; i++) {
    let lineValue = info.chart.lines[i];
    let y = info.chart.height - calc.adjY(lineValue);

    // if this line's y coord is at or above the chart's height then don't draw this line
    if (y >= info.chart.height || y <= 0) continue;

    draw.line(
      svg,                      // elementToAppendTo
      info.margins.left * 0.8,  // x1 (don't draw the line all the way through the margin)
      y,                        // y1
      calc.chartAdjWidth(),     // x2
      y                         // y2
    );
  }

  // X-AXIS LINE
  let xaxisY = info.chart.height;
  let xaxisX1 = info.margins.left;
  let xaxisX2 = calc.chartAdjWidth();
  draw.line(
    svg,                // elementToAppendTo
    xaxisX1,            // x1
    xaxisY,             // y1
    xaxisX2,            // x2
    xaxisY,             // y2
    'axis'
  );

  // Y-AXIS LINE
  let yaxisX = info.margins.left; // don't draw the line all the way through the margin
  draw.line(
    svg,                // elementToAppendTo
    yaxisX,             // x1
    0,                  // y1
    yaxisX,             // x2
    info.chart.height,  // y2
    'axis'
  );
  // END DRAWING LINES

  // LINE LABELS
  for (var i = 0; i < info.chart.lines.length; i++) {
    let lineValue = info.chart.lines[i];
    let y = info.chart.height - calc.adjY(lineValue);

    // if this line's y coord is at or above the chart's height then don't draw this label
    if (y >= info.chart.height || y <= 0) continue;

    lineValue *= 1000000000; // convert to billions
    draw.label(
      svg,                                  // elementToAppendTo
      info.margins.left * 0.8,              // x (don't draw the line all the way through the margin)
      y,                                    // y
      numeral(lineValue).format('$0.00a'),  // text
      '',                                   // transform (don't need to transform)
      'end',                                // text-anchor
      'middle',                             // alignment-baseline
      'axis-label'
    );
  }
});

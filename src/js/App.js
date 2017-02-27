const info = require('./info.js');
const draw = require('./draw.js');
const calc = require('./calculations.js');
info.chart.linesX = calc.generateLinesX();
info.chart.linesY = calc.generateLinesY(5);

const d3 = require('d3');
const moment = require('moment');

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
  document.getElementById('description').textContent = info.data.description;
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

  // BEGIN DRAWING LINES
  // X-AXIS LINES
  for (var i = 0; i < info.chart.linesX.length; i++) {
    let line = info.chart.linesX[i];

    // if this line's x coord is at or past the chart's width then don't draw this line
    if (line.x >= calc.chartAdjWidth() || line.x <= 0) continue;

    draw.line(
      svg,                                            // elementToAppendTo
      line.x,                                         // x1 (don't draw the line all the way through the margin)
      info.chart.height,                              // y1
      line.x,                                         // x2
      info.chart.height + info.margins.bottom * 0.2,  // y2
      'axis'
    );
  }

  // Y-AXIS LINES
  for (var i = 0; i < info.chart.linesY.length; i++) {
    let lineValue = info.chart.linesY[i];
    let y = info.chart.height - calc.adjY(lineValue);

    // if this line's y coord is at or above the chart's height then don't draw this line
    if (y >= info.chart.height || y <= 0) continue;

    draw.line(
      svg,                                        // elementToAppendTo
      info.margins.left * 0.8,                    // x1 (don't draw the line all the way through the margin)
      y,                                          // y1
      calc.chartAdjWidth() - info.margins.right,  // x2
      y                                           // y2
    );
  }

  // X-AXIS LINE
  let xaxisY = info.chart.height;
  let xaxisX1 = info.margins.left;
  let xaxisX2 = info.margins.left + info.values.length * info.bar.width;
  draw.line(
    svg,      // elementToAppendTo
    xaxisX1,  // x1
    xaxisY,   // y1
    xaxisX2,  // x2
    xaxisY,   // y2
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

  // START LINE LABELS
  // X-AXIS LABELS
  for (let i = 0; i < info.chart.linesX.length; i++) {
    let line = info.chart.linesX[i];
    let y = info.chart.height + info.margins.bottom * 0.5;

    // if this x coord is at or past the chart's width then don't draw this label
    if (line.x >= calc.chartAdjWidth() || line.x <= 0) continue;

    draw.label(
      svg,          // elementToAppendTo
      line.x,       // x (don't draw the line all the way through the margin)
      y,            // y
      line.year,    // text
      '',           // transform (don't need to transform)
      'middle',     // text-anchor
      'middle',     // alignment-baseline
      'axis-label'  // class
    );
  }

  // Y-AXIS LABELS
  for (let i = 0; i < info.chart.linesY.length; i++) {
    let lineValue = info.chart.linesY[i];
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
  // END LINE LABELS
});

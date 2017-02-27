const d3 = require('d3');

let activeArrow = '';

module.exports = {
  mouseoverHandler: function(text) {
    let tooltip = document.getElementById('tooltip');
    let tooltipSpan = document.querySelector('#tooltip span');

    let keys = Object.keys(text);
    // loop through each text prop (each key refers to a class within div#tooltip), set textContent
    for (var i = 0; i < keys.length; i++) {
      document.querySelector('#tooltip .' + keys[i]).textContent = text[ keys[i] ];
    }

    // make the tooltip visible
    tooltip.style.visibility = 'visible';
  },
  mousemoveHandler: function() {
    let tooltip = document.getElementById('tooltip');

    // get the rendered height of div#tooltip
    let tooltipHeight = tooltip.offsetHeight;

    let tooltipWidth = tooltip.offsetWidth;
    let arrowWidth = 12; // px
    let pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    let newLeft;

    if (d3.event.pageX + tooltipWidth + arrowWidth > pageWidth) {
      // need to horizontally flip tooltip
      newLeft = (d3.event.pageX - tooltipWidth - arrowWidth) + 'px';
      activeArrow = 'right';
    } else {
      // new left position is x-position of mouse plus the width of the div.arrow child element
      newLeft = (d3.event.pageX + arrowWidth) + 'px';
      activeArrow = 'left';
    }

    // new top position is half tooltipHeight subtracted from the y-position of the mouse
    let newTop = (d3.event.pageY - (tooltipHeight / 2)) + 'px';

    // hide and show the appropriate arrows
    let otherArrow = activeArrow !== 'left' ? 'left' : 'right';
    let otherArrowEl = document.querySelector('#tooltip .arrow.' + otherArrow);
    if (otherArrowEl.style.visibility !== 'hidden') {
      otherArrowEl.style.visibility = 'hidden';
    }
    document.querySelector('#tooltip .arrow.' + activeArrow).style.visibility = 'visible';

    // set the tooltip's new position
    tooltip.style.top = newTop;
    tooltip.style.left = newLeft;
  },
  mouseoutHandler: function() {
    let tooltip = document.getElementById('tooltip');

    document.querySelector('#tooltip .arrow.' + activeArrow).style.visibility = 'hidden';
    tooltip.style.visibility = 'hidden';
  }
}

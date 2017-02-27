const d3 = require('d3');

module.exports = {
  mouseoverHandler: function(text, html) {
    let tooltip = document.getElementById('tooltip');
    let tooltipSpan = document.querySelector('#tooltip span');

    // update the tooltip's text (or html)
    if (html) {
      tooltipSpan.innerHTML = text;
    } else {
      tooltipSpan.textContent = text;
    }

    // make the tooltip visible
    tooltip.style.visibility = 'visible';
  },
  mousemoveHandler: function() {
    let tooltip = document.getElementById('tooltip');

    // get the rendered height of div#tooltip
    let tooltipHeight = tooltip.offsetHeight;

    // new top position is half tooltipHeight subtracted from the y-position of the mouse
    let newTop = (d3.event.pageY - (tooltipHeight / 2)) + 'px';

    // new left position is x-position of mouse plus 12 (the width of the div.arrow child element)
    let newLeft = (d3.event.pageX + 12) + 'px';

    // set the tooltip's new position
    tooltip.style.top = newTop;
    tooltip.style.left = newLeft;
  },
  mouseoutHandler: function() {
    let tooltip = document.getElementById('tooltip');

    tooltip.style.visibility = 'hidden';
  }
}

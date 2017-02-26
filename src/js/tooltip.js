const d3 = require('d3');

module.exports = {
  add: function() {
    let div = document.createElement('div');

    div.id = 'tooltip';
    div.style.position = 'absolute';
    div.style.zIndex = '10';
    div.style.visibility = 'hidden';

    let arrowDiv = document.createElement('div');
    arrowDiv.className = 'arrow';

    let span = document.createElement('span');

    div.appendChild(arrowDiv);
    div.appendChild(span);

    document.body.appendChild(div);
  },
  mouseoverHandler: function(d) {
    let tooltip = document.getElementById('tooltip');
    let tooltipSpan = document.querySelector('#tooltip span');

    tooltipSpan.textContent = d;
    tooltip.style.visibility = 'visible';
  },
  mousemoveHandler: function() {
    let tooltip = document.getElementById('tooltip');

    let tooltipHeight = tooltip.offsetHeight;
    let newTop = (event.pageY - (tooltipHeight / 2)) + 'px';
    let newLeft = (event.pageX + 12) + 'px';

    tooltip.style.top = newTop;
    tooltip.style.left = newLeft;
  },
  mouseoutHandler: function() {
    let tooltip = document.getElementById('tooltip');

    tooltip.style.visibility = 'hidden';
  }
}

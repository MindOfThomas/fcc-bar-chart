const d3 = require('d3');

module.exports = {
  add: function() {
    let div = document.createElement('div');

    div.id = 'tooltip';
    div.style.position = 'absolute';
    div.style.zIndex = '10';
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
  },
  mouseoverHandler: function(d) {
    let tooltip = document.getElementById('tooltip');

    tooltip.textContent = d;
    tooltip.style.visibility = 'visible';
  },
  mousemoveHandler: function() {
    let tooltip = document.getElementById('tooltip');

    let newTop = (event.pageY - 20) + 'px';
    let newLeft = (event.pageX + 12) + 'px';

    tooltip.style.top = newTop;
    tooltip.style.left = newLeft;
  },
  mouseoutHandler: function() {
    let tooltip = document.getElementById('tooltip');

    tooltip.style.visibility = 'hidden';
  }
}

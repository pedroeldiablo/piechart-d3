var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var width = 600;
var height = 600;

var continents = [];

var names =continents.forEach(function(continent) {
  return continent;
});

for (var i =0; i < birthData.length; i++) {
  var continent = birthData[i].continent;
  if( continents.indexOf(continent) === -1 ) {
    continents.push(continent);
  }
}

var colorScale = d3.scaleOrdinal()
  .domain(continents)
  .range(d3.schemeCategory10);

var tooltip = d3.select('body')
  .append('div')
  .classed('tooltip', true);

d3.select('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ', ' + height /2 + ')')
  .classed('chart', true);

d3.select('input')
  .property('min', minYear)
  .property('max', maxYear)
  .property('value', minYear)
  .on('input', function() {
    makeGraph(+d3.event.target.value);
  });

makeGraph(minYear);

function showToolTip(d) {
  tooltip
    .style('opacity', 1)
    .style('left', d3.event.x - (tooltip.node().offsetWidth /2) + 'px')
    .style('top', d3.event.y + 25 + 'px')
    .html(`
        <p>Region: ${d.data.region}</p>
        <p>Continent: ${d.data.continent}</p>
        <p>Births: ${d.data.births.toLocaleString()}</p>
      `);  
}
  
function hideToolTip() {
  tooltip
    .style('opacity', 0);
}
  

function makeGraph(year) {
  var yearData = birthData.filter(d => d.year === year);

  var arcs = d3.pie()
    .value(d => d.births)
    .sort(function(a, b){
      if (a.continent < b.continent) return -1;
      else if (a.continent > b.continent) return 1;
      else return a.births - b.births;
    })
    (yearData);

  var path = d3.arc()
    .outerRadius(width / 2 - 10)
    .innerRadius( width / 4 );

  var update = d3.select('.chart')
    .selectAll('.arc')
    .data(arcs);

  update
    .exit()
    .remove();

  update.enter()
    .append('path')
    .classed('arc', true)
    .merge(update)
    .attr('fill', d => colorScale(d.data.continent))
    .attr('stroke', 'black')
    .attr('d', path)
    .on('mousemove', showToolTip)
    .on('touchStart', showToolTip)
    .on('mouseout', hideToolTip)
    .on('touchEnd', hideToolTip);

}

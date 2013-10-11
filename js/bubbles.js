var bubblesContainer = document.getElementById("test_bubbles");

function convertRawData(data) {
    var children = [];
    for(var i = 0, c = data.length ; i < c ; i++) {
        var node = data[i];
        children.push({
            name: node.name,
            value: node.time
        });
    }

    return { children: children };
}

var diameter = 800,
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(3.5);

var svg = d3.select("#test_bubbles").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var tooltip = d3.select("#test_bubbles").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("./report.json", function(error, data) {
    if (error) {
        console.err(error);
        return;
    }

    var bubblizedData = bubble
        .nodes(convertRawData(data))
        .filter(function(node) {
            return !node.children;
        });

    var node = svg.selectAll(".node")
        .data(bubblizedData)
        .enter()
            .append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .style("fill", function(d) { return color(d.packageName); });

        node.on("mouseover", function(d) {
            tooltip.innerText = d.name + ": " + d.value + "s";
            tooltip
                .transition()
                    .duration(200)
                    .style("opacity", 1);

            tooltip
                .html("<strong>" + d.name + ":</strong> " + d.value + "s")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            tooltip
                .transition()
                    .duration(200)
                    .style("opacity", 0);
        });
});

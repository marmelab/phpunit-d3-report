var bubblesContainer = document.getElementById("test_bubbles");

var data = [
    { name: "testNewArrayIsEmpty", "class": "ArrayTest", file: "/home/sb/ArrayTest.php", line: 6, time: 0.8044 },
    { name: "testArrayContainsAnElement", "class": "ArrayTest", file: "/home/sb/ArrayTest.php", line: 15, time: 0.98044 },
    { name: "testArrayContainsSeveralElement", "class": "ArrayTest", file: "/home/sb/ArrayTest.php", line: 32, time: 2.98044 },
    { name: "testArrayContainsTooManyElement", "class": "ArrayTest", file: "/home/sb/ArrayTest.php", line: 47, time: 7.12044 },
];

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

node.append("title")
    .text(function(d) { return d.name + ": " + d.value + "s"; });

node.append("circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.packageName); });

node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.name });

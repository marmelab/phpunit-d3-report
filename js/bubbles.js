function convertRawData(nodes) {
    var children = [];
    for(var i = 0, c = nodes.length ; i < c ; i++) {
        var node = nodes[i];

        var testsuites = node.testsuites;
        var testcases = node.testcases;

        var subChildren = [];
        if (typeof(node.testsuites) != "undefined") {
            subChildren = node.testsuites;
        } else {
            if (typeof(node.testcases) != "undefined") {
                subChildren = node.testcases;
            }
        }

        var child = {
            name: node.name,
            value: node.time,
        };

        if (subChildren.length) {
            child["children"] = convertRawData(subChildren).children;
        }

        children.push(child);
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

var node;
var originData;

d3.json("./report.json", function(error, data) {
    originData = bubble.nodes(convertRawData(data));
    update(originData.filter(function(n) { return n.depth == 1; }));
});

var currentDepth = 1;
function update(data) {
    node = svg.selectAll(".node").data(data, function(d) { return d.name; });

    node.enter()
        .append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.exit()
        .transition()
            .duration(200)
            .style("opacity", 0)
            .remove();

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
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY + 30) + "px");
        })
        .on("mouseout", function(d) {
            tooltip
                .transition()
                    .duration(200)
                    .style("opacity", 0);
        })
        .on("click", function(d) {
            if (!d.children) {
                return false;
            }

            currentDepth++;

            update(originData.filter(function(node) {
                return containsObject(node, d.children) && node.depth == currentDepth;
            }))
        });
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

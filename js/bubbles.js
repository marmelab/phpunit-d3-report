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

var svg = d3.select("#test_bubbles").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var tooltip = d3.select("#test_bubbles").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var node;
var originData;
var currentNode;

d3.json("./report.json", function(error, data) {
    originData = convertRawData(data);
    currentNode = originData;
    update(function(n) { return n.depth == 1; });
});

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(3.5);

function update() {
    node = svg.selectAll(".node").data(bubble.nodes(currentNode).filter(function(d) {
        return d.depth == (currentNode.depth + 1);
    }), function(d) { return d.name; });

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
        .style("fill", function(d) { return color(d.name); });

        node
            .on("mouseover", showToolTip)
            .on("mouseout", hideToolTip)
            .on("click", function(d) {
                hideToolTip();
                showBackLink();
                currentNode = d;

                if (!d.children) {
                    return false;
                }

                update();
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

function showToolTip(d)
{
    tooltip.innerText = d.name + ": " + d.value + "s";
    tooltip
        .transition()
            .duration(200)
            .style("opacity", 1);

    tooltip
        .html("<strong>" + d.name + ":</strong> " + d.value + "s")
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY + 30) + "px");
}

function hideToolTip(d)
{
    tooltip
        .transition()
            .duration(200)
            .style("opacity", 0);
}

var backLink = document.getElementById("back");

function hideBackLink() {
    backLink.style.display = "none";
}

function showBackLink() {
    backLink.style.display = "inline";
}

document.getElementById("back").addEventListener("click", function(e) {
    e.preventDefault();
    currentNode = currentNode.parent;
    if (!currentNode.parent) {
        hideBackLink();
    }

    update();
});

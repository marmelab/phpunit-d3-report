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
            type: node.type,
        };

        if (node.type == "testsuite") {
            child["failures"] = node.failures;
            child["errors"] = node.errors;
            child["tests"] = node.tests;
            child["success"] = node.tests - node.failures - node.errors;
        } else {
            if (node.error) {
                child["error"] = node.error;
            }

            if (node.failure) {
                child["failure"] = node.failure;
            }
        }

        if (subChildren.length) {
            child["children"] = convertRawData(subChildren).children;
        }

        children.push(child);
    }

    return { children: children };
}

var diameter = 450;

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

function loadSymfony2Bubbles()
{
    d3.json("reports/symfony2.json", function(err, data) {
        originData = convertRawData(data);
        currentNode = originData;
        update();
    });
}

document.getElementById("report_form").addEventListener("submit", function(e) {
    e.preventDefault();

    currentNode = null;
    originData = null;

    document.getElementById("sample_introduction").innerText = "Here is your custom report:";

    hideBackLink();

    var report = document.getElementById("report").value;
    data = ReportTransformer.transform(report);
    originData = convertRawData(data);
    currentNode = originData;
    update();

    window.scrollTo(0);
});

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(15);

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
        .attr("class", function(d) {
            return getNodeClass(d);
        });

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

function getToolTipContent(d)
{
    var time = moment({ seconds: d.value });

    var content  = "<h3>" + d.name + "</h3>";
        content += "<p><strong>Time:</strong> " + pad(time.minutes(), 2) + ":" + pad(time.seconds(), 2);

    if (d.type == "testsuite") {
        content += "<p>" + d.failures + " failures, " + d.errors + " errors, " + d.success + " success</p>";
    } else {
        if (d.error) {
            content += "<div class='error'>";
            content += "    <h5>" + d.error.type + "</h5>";
            content += "    <pre>" + d.error.message + "</pre>";
            content += "</div>";
        } else if (d.failure) {
            content += "<div class='failure'>";
            content += "    <h5>" + d.failure.type + "</h5>";
            content += "    <pre>" + d.failure.message + "</pre>";
            content += "</div>";
        }
    }

    return content;
}

function showToolTip(d)
{
    tooltip
        .html(getToolTipContent(d))
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY + 30) + "px")
        .transition()
            .duration(200)
            .style("opacity", 1);
}

function hideToolTip(d)
{
    tooltip
        .transition()
            .duration(200)
            .style("opacity", 0);
}

var backLink = document.getElementById("back_link");

function hideBackLink() {
    backLink.style.display = "none";
}

function showBackLink() {
    backLink.style.display = "inline";
}

document.getElementById("back").addEventListener("click", function(e) {
    e.preventDefault();
    currentNode = currentNode.parent;
    console.log(currentNode);
    if (!currentNode.parent) {
        hideBackLink();
    }

    update();
});

function getNodeClass(d) {
    if (d.type == "testsuite") {
        if (d.errors) {
            return "errored";
        } else if (d.failures) {
            return "failed";
        }
    }

    if (d.type == "testcase") {
        if (d.error) {
            return "errored";
        }

        if (d.failure) {
            return "failed";
        }
    }

    return "success";
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

loadSymfony2Bubbles();
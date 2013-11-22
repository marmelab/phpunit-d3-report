var chart = d3.chart.phpunitBubbles().padding(2);

// Load Symfony2 test suite sample
d3.json("reports/symfony2.json", function(err, data) {
    d3.select("#bubbles")
        .datum(data)
        .call(chart);
});

// Update chart with user submitted data
document.getElementById("report_form").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("sample_introduction").innerText = "Here is your custom report:";

    var report = document.getElementById("report").value;
    data = ReportTransformer.transform(report);

    d3.select("#bubbles")
        .datum(data)
        .call(chart);

    window.scrollTo(0);
});

// Add tooltip details on hover
d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
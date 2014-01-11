// Compatibility tweaks
window.URL = window.URL || window.webkitURL;

// Global variables
var chart = d3.chart.phpunitBubbles().padding(2);
var jsonReport = null;

// Load Symfony2 test suite sample
d3.json("reports/symfony2.json", function(err, data) {
    jsonReport = data;

    d3.select("#bubbles")
        .datum(data)
        .call(chart);
});

// Update chart with user submitted data
document.getElementById("report_form").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("sample_introduction").innerText = "Here is your custom report:";

    var report = document.getElementById("report").value;
    jsonReport = ReportTransformer.transform(report);

    d3.select("#bubbles")
        .datum(jsonReport)
        .call(chart);

    window.scrollTo(0);
});

// Add tooltip details on hover
d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Authorize JSON report download (for external embedding)
document.getElementById("json_report_download_link").addEventListener("click", function(e) {
    var blob = new Blob([JSON.stringify(jsonReport)]);
    var url =window.URL.createObjectURL(blob);

    this.href = url;
    this.download = 'phpunit-d3-report.json';
});

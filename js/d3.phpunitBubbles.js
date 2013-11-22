d3.chart = d3.chart || {};

d3.chart.phpunitBubbles = function(options) {
	
	var width = 600;
	var height = 450;
	var padding = 2;
	var className = "bubbles";
	
	var sort = function(a, b) {
		return Math.random() < 0.5;
	};

	var onMouseMove = function() {
		d3.select(".tooltip")
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top",  (d3.event.pageY + 5) + "px");
	}

	var onMouseOver = function(data) {
		// Update tooltip content
		var time;
		if (data.value > 1) {
			time = moment({ seconds: data.value });
			time = time.minutes() + ":" + time.seconds();
		} else {
			time = Math.round(data.value * 1000) + "ms";
		}

		var content  = "<h3>" + data.name + "</h3>";
			content += "<p><strong>Time:</strong> " + time;

        if (data.error) {
            content += "<div class='error'>";
            content += "    <h5>" + data.error.type + "</h5>";
            content += "    <pre>" + data.error.message + "</pre>";
            content += "</div>";
        } else if (data.failure) {
            content += "<div class='failure'>";
            content += "    <h5>" + data.failure.type + "</h5>";
            content += "    <pre>" + data.failure.message + "</pre>";
            content += "</div>";
        }

        d3.select(".tooltip").html(content);

		// Display tooltip
		d3.select(".tooltip")
			.transition()
				.duration(200)
				.style("opacity", 1);
	}

	var onMouseOut = function() {
		d3.select(".tooltip").style("opacity", 0);
	}

	function hierarchizeData(data) {
	    var children = [];
	    for(var i = 0, c = data.length ; i < c ; i++) {
	        var datum = data[i];
	        if (datum.time < 0.005) {
	            continue;
	        }

	        children.push({
	            name: datum.name,
	            value: datum.time,
	            type: datum.type,
	            error: datum.error,
	            failure: datum.failure
	        });
	    }

	    return { children: children };
	}

	function getNodeClass(d) {
		if (d.error) {
			return "errored";
		}

		if (d.failure) {
			return "failed";
		}

		return "success";
	}

	function chart(selection) {
		selection.each(function(data) {
			var bubbles = d3.layout.pack()
				.size([width, height])
				.sort(sort)
				.padding(padding);

			d3.select(this).select("svg").remove();

			var svg = d3.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", className);

			var node = svg
				.selectAll(".bubble")
				.data(bubbles.nodes(hierarchizeData(data)).filter(function(d) {
					return d.depth == 1;
				}));

			node.enter()
				.append("g")
					.attr("class", "bubbles")
					.attr("transform", function(d) {
						return "translate(" + d.x + "," + d.y + ")";
					});

			node
				.append("circle")
					.attr("r", function(d) { return d.r; })
					.attr("class", getNodeClass);

			node
				.on("mouseover", onMouseOver)
				.on("mousemove", onMouseMove)
				.on("mouseout",  onMouseOut);
		});
	}

	return chart;
}
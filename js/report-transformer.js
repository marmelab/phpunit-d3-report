var ReportTransformer = {
	transform: function(xmlReport) {
		var doc = (new DOMParser).parseFromString(xmlReport, 'text/xml');

		var parsedReport = [];

		var testCasesIterator = doc.evaluate('//testcase', doc, null, 5, null);
		while (node = testCasesIterator.iterateNext()) {
			parsedReport.push(this.parseTestCase(node));
		}

		return parsedReport;
	},

	parseTestCase: function(testcaseNode) {
		var testCase = {
			type: "testcase",
			name: testcaseNode.getAttribute("name"),
			"class": testcaseNode.getAttribute("class"),
			file: testcaseNode.getAttribute("file"),
			line: testcaseNode.getAttribute("line") * 1,
			time: testcaseNode.getAttribute("time") * 1
		};

		// Add eventual error or failure messages
		var types = ["error", "failure"];
		for (var i = 0, c = types.length ; i < c ; i++) {
			var typedElements = this.getImmediateChildrenByTagName(testcaseNode, types[i]);
			if (typedElements.length) {
				var typedElement = typedElements[0];
				testCase[types[i]] = {
					type: typedElement.getAttribute("type"),
					message: typedElement.innerText
				}
			}
		}

		return testCase;
	},

	getImmediateChildrenByTagName: function(node, tagName) {
		var result = [];
		for (var i = 0, c = node.childNodes.length ; i < c ; i++) {
			var child = node.childNodes[i];
			if (child.tagName === tagName) {
				result.push(child);
			}
		}

		return result;
	}
};

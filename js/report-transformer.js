var ReportTransformer = {
	transform: function(xmlReport) {
		var doc = (new DOMParser).parseFromString(xmlReport, 'text/xml');

		var parsedReport = [];
		
		var testSuitesIterator = doc.evaluate('/testsuites/testsuite', doc, null, 5, null);
		while (node = testSuitesIterator.iterateNext()) {
			parsedReport.push(this.parseTestSuite(node));
		}

		return parsedReport;
	},

	parseTestSuite: function(node) {
		var testSuite = {
			type: "testsuite",
			name: node.getAttribute("name"),
			tests: node.getAttribute("tests") * 1,
			failures: node.getAttribute("failures") * 1,
			errors: node.getAttribute("errors") * 1,
			time: node.getAttribute("time") * 1
		};

		if (file = node.getAttribute("file")) {
			testSuite["file"] = file;
		}

		if (assertions = node.getAttribute("assertions")) {
			testSuite["assertions"] = assertions;
		}

		// Retrieve eventual sub test suites
		var subTestSuites = this.getImmediateChildrenByTagName(node, "testsuite");
		var numberSubTestSuites = subTestSuites.length;
		if (numberSubTestSuites) {
			testSuite["testsuites"] = [];
			for (var i = 0 ; i < numberSubTestSuites ; i++) {
				testSuite["testsuites"].push(this.parseTestSuite(subTestSuites[i]));
			}
		}

		// Add eventual sub testcases
        var testcases = this.getImmediateChildrenByTagName(node, "testcase");
        var numberTestCases = testcases.length;
        if (numberTestCases) {
        	testSuite["testcases"] = [];
        	for (var i = 0 ; i < numberTestCases ; i++) {
        		testSuite["testcases"].push(this.parseTestCase(testcases[i]));
        	}
        }

		return testSuite;
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
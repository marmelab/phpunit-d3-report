<?php

class ReportConverter
{
    private $domDocument;

    private $xpath;

    public function __construct($sourceFeed)
    {
        $this->domDocument = new \DOMDocument();
        $this->domDocument->loadXml($sourceFeed);

        $this->xpath = new \DOMXPath($this->domDocument);
    }

    public function convert()
    {
        $outputReport = array();
        $testSuites = $this->xpath->evaluate('/testsuites/testsuite');
        foreach ($testSuites as $testSuite) {
            $outputReport[] = $this->getTestSuiteAsArray($testSuite);
        }

        return json_encode($outputReport);
    }

    private function getTestSuiteAsArray(\DOMElement $testSuite)
    {
        $outputTestCase = array(
            'name' => $testSuite->getAttribute('name'),
            'file' => $testSuite->getAttribute('file'),
            'tests' => (int) $testSuite->getAttribute('tests'),
            'failures' => (int) $testSuite->getAttribute('failures'),
            'errors' => (int) $testSuite->getAttribute('errors'),
            'time' => (float) $testSuite->getAttribute('time'),
            'testcases' => array(),
        );

        $testCases = $this->xpath->evaluate('//testcase');
        foreach ($testCases as $testCase) {
            $outputTestCase['testcases'][] = $this->getTestCaseAsArray($testCase);
        }

        return $outputTestCase;
    }

    private function getTestCaseAsArray(\DOMElement $testCase)
    {
        return array(
            'name' => $testCase->getAttribute('name'),
            'class' => $testCase->getAttribute('class'),
            'file' => $testCase->getAttribute('file'),
            'line' => (int) $testCase->getAttribute('line'),
            'time' => (float) $testCase->getAttribute('time'),
        );
    }
}

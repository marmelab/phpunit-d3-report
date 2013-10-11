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
            'type' => 'testsuite',
            'name' => $testSuite->getAttribute('name'),
            'tests' => (int) $testSuite->getAttribute('tests'),
            'failures' => (int) $testSuite->getAttribute('failures'),
            'errors' => (int) $testSuite->getAttribute('errors'),
            'time' => (float) $testSuite->getAttribute('time'),
            'testsuites' => array(),
            'testcases' => array(),
        );

        if ($testSuite->hasAttribute('file')) {
            $outputTestCase['file'] = $testSuite->getAttribute('file');
        }

        if ($testSuite->hasAttribute('assertions')) {
            $outputTestCase['assertions'] = (int) $testSuite->getAttribute('assertions');
        }

        // Add eventual sub test suites
        $subTestSuites = $this->getImmediateChildrenByTagName($testSuite, 'testsuite');
        foreach ($subTestSuites as $subTestSuite) {
            $outputTestCase['testsuites'][] = $this->getTestSuiteAsArray($subTestSuite);
        }

        if (!count($outputTestCase['testsuites'])) {
            unset($outputTestCase['testsuites']);
        }

        // Add eventual sub testcases
        $testCases = $this->getImmediateChildrenByTagName($testSuite, 'testcase');
        foreach ($testCases as $testCase) {
            $outputTestCase['testcases'][] = $this->getTestCaseAsArray($testCase);
        }

        if (!count($outputTestCase['testcases'])) {
            unset($outputTestCase['testcases']);
        }

        return $outputTestCase;
    }

    private function getTestCaseAsArray(\DOMElement $testCase)
    {
        return array(
            'type' => 'testcase',
            'name' => $testCase->getAttribute('name'),
            'class' => $testCase->getAttribute('class'),
            'file' => $testCase->getAttribute('file'),
            'line' => (int) $testCase->getAttribute('line'),
            'time' => (float) $testCase->getAttribute('time'),
        );
    }

    /**
     * Traverse an elements children and collect those nodes that
     * have the tagname specified in $tagName. Non-recursive
     *
     * @param DOMElement $element
     * @param string $tagName
     * @return array
     */
    function getImmediateChildrenByTagName(\DOMElement $element, $tagName)
    {
        $result = array();
        foreach($element->childNodes as $child)
        {
            if($child instanceof DOMElement && $child->tagName == $tagName)
            {
                $result[] = $child;
            }
        }
        return $result;
    }
}

<?php

class ReportConverter
{
    private $domDocument;

    public function __construct($sourceFeed)
    {
        $this->domDocument = new \DOMDocument();
        $this->domDocument->loadXml($sourceFeed);
    }

    public function convert()
    {
        $xpath = new \DOMXPath($this->domDocument);
        $testCases = $xpath->evaluate('//testcase');

        foreach ($testCases as $testCase) {
            $outputReport[] = array(
                'name' => $testCase->getAttribute('name'),
                'class' => $testCase->getAttribute('class'),
                'file' => $testCase->getAttribute('file'),
                'line' => $testCase->getAttribute('line'),
                'time' => $testCase->getAttribute('time'),
            );
        }

        return json_encode($outputReport);
    }
}

<?php

class ReportConverter
{
    private $sourcePath;

    private $domDocument;

    public function __construct($sourcePath)
    {
        if (!file_exists($sourcePath)) {
            throw new \Exception(sprintf('Unable to find "%s" file.', $sourcePath));
        }

        $this->sourcePath = $sourcePath;

        $this->domDocument = new \DOMDocument();
        $this->domDocument->load($this->sourcePath);
    }

    public function convert($destinationPath)
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

        file_put_contents($destinationPath, json_encode($outputReport));
    }
}

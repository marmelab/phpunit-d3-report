<?php

$input = '../report.xml';
$output = 'report.json';

$outputReport = array();

$domDocument = new \DOMDocument();
$domDocument->load($input);

$xpath = new \DOMXPath($domDocument);
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

file_put_contents($output, json_encode($outputReport));

echo 'Report successfully converted.';

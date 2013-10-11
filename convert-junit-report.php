<?php

require('ReportConverter.php');

$input = '../report.xml';
$output = 'report.json';

$outputReport = array();

try {
    if (!file_exists($input)) {
        throw new \Exception(sprintf('Unable to open file "%s".', $input));
    }
    $sourceFeed = file_get_contents($input);

    $reportConverter = new ReportConverter($sourceFeed);
    $convertedFeed = $reportConverter->convert();

    file_put_contents($output, $convertedFeed);
} catch (\Exception $e) {
    echo 'Error: '.lcfirst($e->getMessage());
    exit(1);
}

echo 'Report successfully converted.';

<?php

require('ReportConverter.php');

$input = '../report.xml';
$output = 'report.json';

$outputReport = array();

try {
    $reportConverter = new ReportConverter($input);
    $reportConverter->convert($output);
} catch (\Exception $e) {
    echo 'Error: '.lcfirst($e->getMessage());
}

echo 'Report successfully converted.';

<?php

require(__DIR__.'/../ReportConverter.php');

class ReportConverterTest extends \PHPUnit_Framework_TestCase
{
    public function testConvert()
    {
        $feed = <<<EOL
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
    <testsuite name="Project Test Suite" tests="2" assertions="14" failures="0" errors="0" time="0.024016">
        <testsuite name="ArrayTest" file="/home/sb/ArrayTest.php" tests="2" failures="0" errors="0" time="0.016030">
            <testcase name="testNewArrayIsEmpty"
                class="ArrayTest"
                file="/home/sb/ArrayTest.php"
                line="6"
                time="0.008044"/>
            <testcase name="testArrayContainsAnElement"
                class="ArrayTest"
                file="/home/sb/ArrayTest.php"
                line="15"
                time="0.007986"/>
            <testcase name="testWithError" class="ArrayTest" file="/home/sb/ArrayTest.php" line="41" time="0.003614">
                <error type="InvalidArgumentException">This is the error message.</error>
            </testcase>
        </testsuite>
    </testsuite>
</testsuites>
EOL;

        $expectedFeed = json_encode(
            array(
                array(
                    'type' => 'testsuite',
                    'name' => 'Project Test Suite',
                    'tests' => 2,
                    'assertions' => 14,
                    'failures' => 0,
                    'errors' => 0,
                    'time' => 0.024016,
                    'testsuites' => array(
                        array(
                            'type' => 'testsuite',
                            'name' => 'ArrayTest',
                            'file' => '/home/sb/ArrayTest.php',
                            'tests' => 2,
                            'failures' => 0,
                            'errors' => 0,
                            'time' => 0.016030,
                            'testcases' => array(
                                array(
                                    'type' => 'testcase',
                                    'name' => 'testNewArrayIsEmpty',
                                    'class' => 'ArrayTest',
                                    'file' => '/home/sb/ArrayTest.php',
                                    'line' => 6,
                                    'time' => 0.008044,
                                ),
                                array(
                                    'type' => 'testcase',
                                    'name' => 'testArrayContainsAnElement',
                                    'class' => 'ArrayTest',
                                    'file' => '/home/sb/ArrayTest.php',
                                    'line' => 15,
                                    'time' => 0.007986,
                                ),
                                array(
                                    'type' => 'testcase',
                                    'name' => 'testWithError',
                                    'class' => 'ArrayTest',
                                    'file' => '/home/sb/ArrayTest.php',
                                    'line' => 41,
                                    'time' => 0.003614,
                                    'error' => array(
                                        'type' => 'InvalidArgumentException',
                                        'message' => 'This is the error message.',
                                    )
                                ),
                            ),
                        )
                    ),
                ),
            )
        );

        $reportConverter = new ReportConverter($feed);
        $outputFeed = $reportConverter->convert();

        $this->assertJsonStringEqualsJsonString($expectedFeed, $outputFeed);
    }
}

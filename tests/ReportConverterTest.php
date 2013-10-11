<?php

require(__DIR__.'/../ReportConverter.php');

class ReportConverterTest extends \PHPUnit_Framework_TestCase
{
    public function testConvert()
    {
        $feed = <<<EOL
<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="ArrayTest"
             file="/home/sb/ArrayTest.php"
             tests="2"
             failures="0"
             errors="0"
             time="0.016030">
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
  </testsuite>
</testsuites>
EOL;

        $expectedFeed = json_encode(
            array(
                array(
                    'name' => 'ArrayTest',
                    'file' => '/home/sb/ArrayTest.php',
                    'tests' => 2,
                    'failures' => 0,
                    'errors' => 0,
                    'time' => 0.016030,
                    'testcases' => array(
                        array(
                            'name' => 'testNewArrayIsEmpty',
                            'class' => 'ArrayTest',
                            'file' => '/home/sb/ArrayTest.php',
                            'line' => 6,
                            'time' => 0.008044,
                        ),
                        array(
                            'name' => 'testArrayContainsAnElement',
                            'class' => 'ArrayTest',
                            'file' => '/home/sb/ArrayTest.php',
                            'line' => 15,
                            'time' => 0.007986,
                        ),
                    ),
                )
            )
        );

        $reportConverter = new ReportConverter($feed);
        $outputFeed = $reportConverter->convert();

        $this->assertJsonStringEqualsJsonString($expectedFeed, $outputFeed);
    }
}

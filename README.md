# PHPUnit D3 report

This visualization tool provides a quick way to monitor your PHPUnit test suites. With a single glance, you will be able to identify the slowest tests, helping you to improve the overall execution time of your tests.

Developed during a hackday at [Marmelab](http://www.marmelab.com), this tool is currently pretty raw, but will be improved over time.

## How to generate a report?

To generate a report, simply execute your PHPUnit test suite including the `--log-junit` argument, such as:

``` sh
phpunit --log-junit report.xml
```

Then, execute the `convert-junit-report.php` script to translate the XML report into a report-ready form. In current version, the XML report should be one folder above the script (it will be improved in a future version).

Finally, simply open the `report.html` page into your browser. Be careful: for security reasons, you have to configure a VHost to make it work.

## Todos

Several features will be added in the next weeks:

* General code cleaning
* Using PHPUnit JSON format instead of XML one
* Remove JUnit report conversion to input the feed directly on the interface (will especially allow to use this reporting utility directly from GitHub pages, without having to install anything locally)

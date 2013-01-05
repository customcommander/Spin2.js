## About these specifications

I am using [Testem](https://github.com/airportyh/testem) in order to run my tests across different browsers automatically. It serves me well and you should probably give it a try ;-)

This means that if you do not have Testem installed on your machine you cannot run these tests unless you modify index.html:

* Remove references to Testem.
* Add a Jasmine reporter of your choice. (e.g. a Console reporter.)

*Please not that I have removed the HTML reporter from the Jasmine directory as I have no use for it.*
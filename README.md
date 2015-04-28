node-dynamic-placeholder-images 
=========

**_still a work in progress_**

node-dynamic-placeholder-images (aka **ndpimg**) is a [node.js] app to serve up placeholder images on the fly via HTTP.  
This is a rewrite of [baconmockup.com] in node, and originally inspired by [placekitten.com].


Tech
-----------
* [node.js] 
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [EasyImage] - for resizing/croping source images


Important Files
-----------
* lib/dphimg.js - library for reading or generating dynamically resized source images
* app.js - the baconmockup.com web site for handling HTTP requests
* imagelist.json - JSON list of source image files, plus attribution data for the web site


Installation
--------------
```sh
blah blah blah
```

Version History
----
* 0.1 (Jan 7th 2013) - Initial GitHub commit



[baconmockup.com]:http://baconmockup.com/
[placekitten.com]:http://placekitten.com/
[node.js]:http://nodejs.org
[@tjholowaychuk]:http://twitter.com/tjholowaychuk
[express]:http://expressjs.com
[EasyImage]:https://github.com/hacksparrow/node-easyimage



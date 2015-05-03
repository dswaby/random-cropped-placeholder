// had some issues with vagrant, this fixed it
// root@precise32:/vagrant_GitHub/node-baconmockup# cat /proc/sys/fs/inotify/max_user_instances
// 128
// root@precise32:/vagrant_GitHub/node-baconmockup# echo 8192 > /proc/sys/fs/inotify/max_user_instances


var port = 5399;
var cacheTime = 86400000*7; 
var fs = require('fs');
var express = require('express');
var app = express();
var easyimg = require('easyimage');
var path = require('path');
var DynamicPlaceholderImages = require('./lib/dphimg.js');


// directories
var source_images_dir = './source-images';
var resized_images_cache = '.resized-images-cache';

// our list of images, loaded in configure callback
var imagelist;

// base data model
var model = {
	'SiteName':'pillowparty.me',
	'Title':'Pillow Party Placeholders'
};


// configure the app
// app.configure(function() {

	app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, 'public',{ maxAge: cacheTime })));

	// make the cache directory if it doesn't exist
	fs.mkdir(resized_images_cache, function(err, data) { });

	loadImageList('imagelist.json', function afterLoadImageList(err, data) {
		if (err)
			console.log('loadImageList: ' + err);
		else {
			imagelist = data;
			console.log('imagelist loaded');
			// fire up the web server
			app.listen(port);
			console.log('Listening on port ' + port);

		}
	});

// });


/**********/
/* Routes */
/**********/


// home page
app.get('/', function(req, res) {
	res.render('index', { model:model } , function(err, html) {
		res.send(html);
	});
});

// attribution page
app.get('/attribution', function(req, res) {
	// TODO build attribution data model
	res.render('attribution', { model:model } , function(err, html) {
		res.send(html);
	});
});


// route for generating an image /width/height/tag
app.get(/\/([\d]+)\/([\d]+)\/*([0-9a-zA-Z\-]*)\/?/, function sendDynamicPlaceholder(req, res){
	// 0 is width
	// 1 is height
	// 2 is an optional tag
	//console.log(req.params);

	var width = parseInt(req.params[0], 10) || 0;
	var height = parseInt(req.params[1], 10)|| 0;
	var tag = req.params[2].trim().toLowerCase();


	var dynamicPlaceholderImages = new DynamicPlaceholderImages(source_images_dir, resized_images_cache, imagelist);

	dynamicPlaceholderImages.on('filedata', function(data) {
		sendResizedImage(res, data.binarydata, data.filename, function(err, data) {
			if (err)
				console.log(err);
		});
    res.end(data);
    // console.log(req);
	}).on('error', function(err) {
		console.log(err);
		send404Page(req, res);
	});

	dynamicPlaceholderImages.perform(tag, width, height);
	
});




//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
	send404Page(req, res);
});




function send404Page(req, res) {
	res.render('404', { model:model }, function(err, html) {
		res.end(html, 404);
	});
}






function sendResizedImage(res, binarydata, filename, callback) {

	try {
    res.setHeader('Cache-Control', 'public, max-age=3600'));
		res.setHeader('Content-Type', 'image/jpeg');
		res.setHeader('Content-Disposition', 'inline; filename=' + filename);
		res.setHeader('Content-Length', binarydata.length);
		res.end(binarydata, 'binary');

		return callback(null, {
			"filename": filename,
			"data_length": binarydata.length
		});

	} catch (e) {
		return callback(e, null);
	}

}


function loadImageList(filename, callback) {
	fs.readFile(filename, function(err, data) {
		if (err) {
      console.log("loadImageList error", err)
			return callback(err, null);
		}
		else {
			try {
				var list = JSON.parse(data);
				return callback(null, list);
			} catch (e) {
				return callback(e);
			}
			
		}

	});

}
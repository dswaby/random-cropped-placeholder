// http://dev.tutsplus.com/tutorials/managing-the-asynchronous-nature-of-node-js--net-36183

var util = require('util');
var events = require("events");
var fs = require('fs');
var easyimg = require('easyimage');

 
function dphimg(source_images_dir, resized_images_cache_dir, imagelist) {
  console.log("source_images_dir", source_images_dir)
	events.EventEmitter.call(this);

	function __getSourceImage(tag, width, height, emitter, callback) {
	
		if (!imagelist)
			emitter.emit('error', new Error('imagelist is null'));

		if (imagelist.length === 0)
			emitter.emit('error', new Error('imagelist is empty'));

		if (tag === '' || tag === 'random') {

			return callback(null, imagelist[Math.floor(Math.random() * imagelist.length)], width, height, emitter);
		} else {

			for (var i = imagelist.length - 1; i >= 0; i--) {
				if (imagelist[i].tag === tag)
					return callback(null, imagelist[i], width, height, emitter);
			}

		}

		// tag doesn't exist
		emitter.emit('error', new Error('invalid image tag'));
	}


	function __readFile(err, imagedata, width, height, emitter) {
		if (err) {
			console.log("err", err);
			return;
		} 

		// filename for the browser
		var filename = imagedata.tag + '-' + width + '-' + height + '.jpg';

		fs.readFile(resized_images_cache_dir + '/' + filename, function afterReadFile(err, binarydata) {
			if (binarydata) {
				imagedata.binarydata = binarydata;
				imagedata.filename = filename;
        console.log(imagedata)
				emitter.emit('filedata', imagedata);
			} else {
        console.log("n0 binary data")
				generateResizedImage(filename, imagedata, width, height, emitter);
			}
		});

	} 

	function generateResizedImage(destination, imagedata, width, height, emitter) {
    destination = './../' + destination;
		// resize options (https://github.com/hacksparrow/node-easyimage)
		var resCropOptions = {
			'src': source_images_dir + '/' + imagedata.filename,
			'dst': destination,
			'width': width,
			'height': height,
			'fill': true
		};

		easyimg.rescrop(resCropOptions).then(function afterResCrop(image) {
      
      fs.readFile(destination, function(err, binarydata) {
        if (binarydata) {
          imagedata.binarydata = binarydata;
          emitter.emit('filedata', imagedata);
        } else {
          emitter.emit('error', err);
        }
      });

    });

	}


	function perform(tag, width, height) {

		// get source image
		// read file
		// generate if not present
		// emit resized info

		__getSourceImage(tag, width, height, this, __readFile);


	}

	this.perform = perform;

}


util.inherits(dphimg, events.EventEmitter);
module.exports = dphimg;

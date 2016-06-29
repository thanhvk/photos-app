var express = require('express');
var router = express.Router();
var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

exports.list = function(req, res, next) {
	Photo.find(function(err, photos) {
		if (err) return next(err);
		res.render('photos', {
			title: 'Photos',
			photos: photos
		});
	});	
}

exports.form = function(req, res, next) {
	res.render('photos/upload', {
		title: 'Photo Upload'
	})
}

exports.submit = function(dir) {
	return function(req, res, next) {
		var form = new formidable.IncomingForm();

		form.parse(req, function(err, fields, files) {
			console.log(files.image.name);;
			var img = files.image;
			var name = fields.name || img.name;
			var pathFile = path.join(dir, img.name);

			fs.rename(img.path, pathFile, function(err) {
				if (err) return next(err);

				Photo.create({
					name: name,
					path: img.name
				}, function(err) {
					if (err) return next(err);
					res.redirect('/');
				});
			});
		});
	}
}

exports.download = function(dir) {
	return function(req, res, next) {
		var id = req.params.id;

		Photo.findById(id, function(err, photo) {
			if (err) return next(err);
			var pathFile = path.join(dir, photo.path);
			res.download(pathFile, photo.path); 
		})
	}
}
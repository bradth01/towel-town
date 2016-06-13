'use strict'

// PATH FROM HOME: /api/towels/

var express = require('express');
var router = express.Router();
var db = require('../../db/index');
var Towel = db.model('towel');
var Review = db.model('review');

router.param('towelId', function(req, res, next, id) {
        Towel.findById(id, {
        	include: [Review]
        })
	.then(function(towel) {
		req.towel = towel;
		next();
	})
	.catch(next);
});

router.get('/', function(req, res, next) {
	Towel.findAll({
		include: [Review]
	})
	.then(function(towels) {
		res.json(towels);
	})
	.catch(next);
});

router.get('/:towelId', function(req, res, next) {
	res.json(req.towel);
});

router.get('/:towelId/reviews', function (req, res, next) {
  Review.findAll({
    where: {
      towelId : req.towel.id
    }
  })
  .then(function (foundReviews) {
    if (!foundReviews) {
      res.sendStatus(404);
    } else {
      res.json(foundReviews);
    } 
  }) 
  .catch(next);
});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('news/index', { title: 'Naija Scraper' });
});

// Bring in the scrape function from the scripts directory
var scrape = require('../scripts/scrape');

// Bring headlines and notes from the controller
var headlinesController = require('../controllers/headline');
var notesController = require('../controllers/notes');


module.exports = router;



/*
NEW YORK TIMES
div class="story-body"  
  a class="story-link"
  div class="story-meta"
    h2 class="headline"
    p class="summary"
  div class="wide-thumb"

LINDA IKEJI
<article class="story-block"
  <figure class="story_img"
    <h1 class="story-title"
      <a href=
    <div class="img_view"
  <div class="story_meta"
  <div class="meta"

*/
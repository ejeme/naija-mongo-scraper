// scrape script
// =============

// Require request and cheerio, making our scrapes possbible
var request = require('request');
var cheerio = require('cheerio');


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every article from the NY Times\n" +
            "front page:" +
            "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument

   var scrape = function (cb) { 
       request("https://www.nytimes.com", function(err, res, body) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(body);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $(".theme-summary").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(this).text().trim;

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(this).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link    
    });
    
  });
});
cb(results);
}

module.exports = scrape;

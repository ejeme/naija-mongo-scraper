// Routes
var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var Note = require('../models/Note');

app.get("/", function(req, res) {
	Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.render("index", {articles: data});
		}
	});
});

app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/world", function(error, response, html) {
		var $ = cheerio.load(html);
		var result = {};
		$("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
			result.link = link;
			result.title = title;
			if (summary) {
				result.summary = summary;
			};
			if (img) {
				result.img = img;
			}
			else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
			};
			var entry = new Article(result);
			Article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape finished.");
		res.redirect("/");
	});
});

app.get("/saved", function(req, res) {
	Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "You have not saved any articles yet. Try to save some delicious news by simply clicking \"Save Article\"!"});
		}
		else {
			res.render("saved", {saved: data});
		}
	});
});

app.get("/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		res.json(data);
	})
})

app.post("/search", function(req, res) {
	console.log(req.body.search);
	Article.find({$text: {$search: req.body.search, $caseSensitive: false}}, null, {sort: {created: -1}}, function(err, data) {
		console.log(data);
		if (data.length === 0) {
			res.render("placeholder", {message: "Nothing has been found. Please try other keywords."});
		}
		else {
			res.render("search", {search: data})
		}
	})
});

app.post("/save/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

app.post("/note/:id", function(req, res) {
	var note = new Note(req.body);
	note.save(function(err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, function(err, newdoc) {
			if (err) throw err;
			else {
				res.send(newdoc);
			}
		});
	});
});

app.get("/note/:id", function(req, res) {
	var id = req.params.id;
	Article.findById(id).populate("note").exec(function(err, data) {
		res.send(data.note);
	})
})

module.exports = router;
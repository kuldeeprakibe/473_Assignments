var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app;

app = express();
http.createServer(app).listen(3000);



app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost/links");

var linksSchema = mongoose.Schema({
    title: String,
    link: String,
    clicks: Number
});

var Links = mongoose.model("Links", linksSchema);

app.get("/links", function(req, res) {
    "use strict";
    Links.find({}, function(err, links) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(links);
    });
});

app.post("/links", function(req) {
    "use strict";
        var linkurl = req.body.linkText,
        title = req.body.titleText;

    var newLink = new Links({
        "title": title,
        "link": linkurl,
        "clicks": 0
    });
    newLink.save();
});

app.get("/clicks/:title", function(req, res) {
    "use strict";
    var reqTitle = req.params;

    Links.update(reqTitle, {
        $inc: {
            clicks: 1
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });

    Links.find({
        "title": reqTitle.title
    }, function(err, result) {
        if (err) {
            console.log(err);
        }
          res.redirect(result[0].link);
    });
});

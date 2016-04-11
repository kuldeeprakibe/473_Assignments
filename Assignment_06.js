var express = require("express"),
    http = require("http"),
    redis = require("redis"),
    bodyParser = require("body-parser"),
    redisClient,
    app;

redisClient = redis.createClient();
app = express();
http.createServer(app).listen(3000);
var winsCount = 0,
    lossesCount = 0,
    guess, resultSet = ["head", "tail"];
app.use(bodyParser.json());


app.post("/flip", function(req, res) {
    "use strict";
    guess = req.body.call;
    var index = Math.floor((Math.random() * 2) + 1);

    if (guess === resultSet[index - 1]) {
        redisClient.incr("wins");
        res.json({
            "result": "win"
        });
    } else {
        redisClient.incr("losses");
        res.json({
            "result": "lose"
        });
    }

});



app.get("/stats", function(req, res) {
    "use strict";

    redisClient.mget(["wins","losses"], function(err, result) {
        if (err !== null) {
            console.log(err);
            return;
        }

        winsCount = parseInt(result[0], 10) || 0;
        lossesCount = parseInt(result[1], 10) || 0;
    });

    res.json({
        "wins": winsCount,
        "losses": lossesCount
    });
});



app.delete("/stats", function() {
    "use strict";

    redisClient.set("wins", 0);
    redisClient.set("losses", 0);
});

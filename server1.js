var express = require("express"),
    app = express(),
    http = require("http").createServer(app),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");


app.use(express.static(__dirname + "/client"));

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost/amazeriffic");

var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);
app.get("/todos.json", function(req, res) {
    "use strict";
    ToDo.find({}, function(err, toDos) {
        res.json(toDos);
    });
});

app.post("/todos", function(req, res) {
    "use strict";
    console.log("body is: ");
    console.log(req.body);

    var newToDo = new ToDo({
        "description": req.body.description,
        "tags": req.body.tags
    });

    newToDo.save(function(err) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        } else {
            ToDo.find({}, function(err, result) {
                if (err !== null) {
                     res.send("ERROR");
                }
                res.json(result);
            });
        }
    });

});
http.listen(3000, function() {
    "use strict";
    console.log("Listenning on port 3000...");
});

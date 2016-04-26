var express = require("express"),
    app = express(),
    http = require("http").createServer(app),
    io = require("socket.io")(http);

io.on("connection", function(socket) {
    "use strict";
    console.log("user connected");


    socket.on("user post", function(post) {
        socket.broadcast.emit("user post", post);
    });
});

http.listen(8080, function() {
    "use strict";
    console.log("Listenning on port 8080...");
});

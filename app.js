var main = function(toDoObjects) {
    "use strict";
    var socket = io.connect("http://localhost:8080/");
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function(toDo) {
        return toDo.description;
    });


   socket.on("user post", function() {
        console.log("A socket is back form the server:");
        alert("Hey, A post has been added!");

        $.getJSON("todos.json", function(newToDoObjects) {
            toDoObjects = newToDoObjects;
            toDos = newToDoObjects.map(function(toDo) {
                return toDo.description;
            });

            var $li = $("<li>").text(toDos[toDos.length - 1]);
            var newObj = toDoObjects[toDoObjects.length - 1];
            var $tag = $("<h3>").text(newObj.tags[0]);
            console.log(newObj.tags[0]);

            $(".tabs a span").toArray().forEach(function(element) {
                var $element = $(element);
                if ($element.hasClass("active")) {
                    if ($element.parent().is(":nth-child(1)")) {
                        console.log("this is tab 1");
                        $(".content ul").prepend($li);
                    } else if ($element.parent().is(":nth-child(2)")) {
                        console.log("this is tab 2");
                        $(".content ul").append($li);
                    } else if ($element.parent().is(":nth-child(3)")) {
                        var found = 0;
                        $(".content h3").toArray().forEach(function(hTag) {
                            var $hTag = $(hTag);
                            if ($hTag.text() === newObj.tags[0]) {
                                found++;
                            } else {
                                found = 0;
                            }
                        });
                        if (found === 0) {
                            console.log("the tag is new");
                            $(".content").append($tag);
                            $(".content").append($li);
                        } else {
                            console.log("the tag is already there");
                            var str = "<h3>" + newObj.tags[0] + "</h3>";
                            $li.after(str);
                            $(".content").append($li);
                        }
                    }

                }
            });

        });
    });



    $(".tabs a span").toArray().forEach(function(element) {
        var $element = $(element);

        $element.on("click", function() {
            var $content,
                $input,
                $button,
                i;
            console.log(toDos);
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function(todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });


                var tagObjects = tags.map(function(tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function(toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });



                tagObjects.forEach(function(tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: ");
                $input = $("<input>").addClass("description");
                $button = $("<span>").text("+");

                $button.on("click", function() {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description": description,
                            "tags": tags
                        };

                    socket.emit("user post", "Todos list updated!");
                    console.log("the new todo socket: ");

                    $.post("todos", newToDo, function(result) {
     
                        toDoObjects = result;

                        toDos = toDoObjects.map(function(toDo) {
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
                });


                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function() {
    "use strict";
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
});
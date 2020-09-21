"use strict";

var OnLoad = function () {
    connection.invoke("CheckLogin")
        .then(function (resp) {
            if (resp) {
                document.getElementById("divChat").style.display = "block";
                connection.invoke("GetCurrentUser").then(function (user) {
                    document.getElementById("userInput").value = user;
                    document.getElementById("userInput").disabled = true;
                })
            }
            else
                document.getElementById("notLogged").style.display = "block";
        })
        .catch(function (err) {
            return console.error(err.toString());
        });
    event.preventDefault();
}

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says: " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
    OnLoad();
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    debugger;
    if (message.toString().substring(0, 7) === "/stock=") {
        connection.invoke("ReadCSV", message.toString().substring(7)).catch(function (err) {
            return console.error(err.toString());
        });
    }
    else {
        connection.invoke("SendMessage", user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();
});
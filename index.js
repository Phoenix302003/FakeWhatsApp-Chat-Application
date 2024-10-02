const express = require("express");
const app = express();
const mongoose = require('mongoose');
let port = 8080;
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
};

app.get("/", (req, res) => {
    res.send("Welcome to root route");
});

// Index Route
app.get("/chats", asyncWrap(async(req, res, next) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", {chats});
}));

// New Route
app.get("/chats/new", (req, res, next) => {
    try{
        res.render("new.ejs");
    }catch(err) {
        next(err);
    }
});

// Create Route
app.post("/chats", asyncWrap(async (req, res, next) => {
    let {from, to, msg} = req.body;
    let newChat = new Chat({
    from: from,
    to: to,
    msg :msg,
    created_at: new Date(),
});
await newChat.save();
res.redirect("/chats");
}));

function asyncWrap(fn){
    return function(req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    };
}

// Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let {id} = req.params;
    const chat = await Chat.findById(id);
    if(!chat) {
        return next(new ExpressError(404, "Page not Found"));
    }
    res.render("edit.ejs", {chat});
}));

// Edit Route
app.get("/chats/:id/edit", asyncWrap(async (req, res, next) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});    
}));

// Update Route
app.put("/chats/:id", asyncWrap(async (req, res, next) => {
    let {id} = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
    id,
    {msg: newMsg},
    {runValidators: true, new: true}
);
res.redirect("/chats");
}));

// Destroy Route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");   
}));

// Mongoose Errors
const handleValidationErr = (err) => {
    console.log("This is a validation error");
    console.dir(err.message);
    return err;
};

app.use((err, req, res, next) => {
    console.log(err.name);
    if(err.name === "ValidationError") {
        err = handleValidationErr(err);
    }
    next(err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let {status = 500, message = "Some error occured"} = err;
    res.status(status).send(message);
})

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});
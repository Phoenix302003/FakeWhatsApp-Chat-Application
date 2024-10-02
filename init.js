const mongoose = require('mongoose');

const Chat = require("./models/chat.js");

main().then((res) => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
};

let allChats = [
    {
        from: 'Rajesh',
        to: 'Trisha',
        msg: "It's been a while since we last talked.",
        created_at: new Date()
    },
    {
        from: "Rohit",
        to: "Aisha",
        msg: "Aisha, we need to finalize the presentation by tonight.",
        created_at: new Date()
    },
    {
        from: "Sneha",
        to: "Kabir",
        msg: "Kabir, can you help me with this bug I'm stuck on?",
        created_at: new Date()
    },
    {
        from: "Arjun",
        to: "Rakhi",
        msg: "Hey Sneha, did you check out the new project guidelines?",
        created_at: new Date()
    },
    {
        from: "Meera",
        to: "Rohan",
        msg: "Rohan, I sent you the document. Let me know your thoughts.",
        created_at: new Date()
    },
];

Chat.insertMany(allChats);
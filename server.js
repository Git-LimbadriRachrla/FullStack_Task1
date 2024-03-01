const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

const User = mongoose.model("User", {
    name: String,
    email: String
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
    const { name, email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(200).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "An error occurred while registering user" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

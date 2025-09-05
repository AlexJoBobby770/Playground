const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.envmongokey, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {console.log("Connected to MongoDB")})
.catch((err) => {console.log(err)});

const userSchema = new mongoose.Schema({
    username: String,
    userid: String,
});
 const User=mongoose.model("user", userSchema);

 app.get("/", (req, res) => {res.send("Hello World")});
  
 app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (user) {
      res.json({ status: "success" });
    } else {
      res.json({ status: "error", message: "Invalid credentials" });
    }
  });

  app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ status: "success" });
  });

  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));


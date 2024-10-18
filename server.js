require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const connectToMongo = require("./db.js");
connectToMongo();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => { res.send("Test API success") })
app.use("/api", require("./routes/index"));

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

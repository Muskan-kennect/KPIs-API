
const express = require('express');
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const cors = require('cors');

const db = require("./config/dbConnection");
const draftRouter = require("./Routes/draftRoutes");

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/draft",draftRouter);

app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
});

const { MongoClient } = require('mongodb');

const dotenv = require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URL);

module.exports=client;

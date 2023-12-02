const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


// middle ware:
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyyhzcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // collections:
        const classesCollection = client.db("eduCareSolutions").collection("classes");
        const blogsCollection = client.db("eduCareSolutions").collection("blogs");
        const sessionsCollection = client.db("eduCareSolutions").collection("sessions");
        const usersCollection = client.db("eduCareSolutions").collection("users");

        // classes:
        app.get("/classes", async(req, res)=>{
            const query={}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const result = await classesCollection.find(query).toArray();
            res.send(result)
        })


        // sessions:
        app.get("/sessions", async(req, res)=>{
            const query={}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const result = await sessionsCollection.find(query).toArray();
            res.send(result)
        })


        // blogs:
        app.get("/blogs", async(req, res)=>{
            const query={}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const result = await blogsCollection.find(query).toArray();
            res.send(result)
        })


        // users:
        app.get("/users", async(req, res)=>{
            const query={}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Edu-Care Soltuion network is running...");
})


app.listen(port, (req, res) => {
    console.log(`Edu-Care Soltuion API is running on port: ${port}`);
})

const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


// middle ware:
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: "unAuthorized User" });
    }
    const token = authorization.split(" ")[1];

    // verifying:
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).send({ error: true, message: "unAuthorized User" });
        }
        req.decoded = decoded;
        next();
    })
}



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
        const categoryCollection = client.db("eduCareSolutions").collection("categorys");
        const classesCollection = client.db("eduCareSolutions").collection("classes");
        const blogsCollection = client.db("eduCareSolutions").collection("blogs");
        const sessionsCollection = client.db("eduCareSolutions").collection("sessions");
        const usersCollection = client.db("eduCareSolutions").collection("users");


        // -----authentication-------
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            });
            res.send({ token });
        })


        // -----------category--------------:
        app.get("/categorys", async (req, res) => {
            const result = await categoryCollection.find().toArray();
            res.send(result)
        })

        app.get("/categorys/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query);
            res.send(result)
        })

        app.post("/categorys", async (req, res) => {
            const category = req.body;
            const result = await categoryCollection.insertOne(category);
            res.send(result)
        })

        app.patch("/categorys/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const category = req.body;
            const updatedDoc = {
                $set: {
                    categoryName: category.categoryName
                }
            }
            const result = await categoryCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.delete("/categorys/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.deleteOne(query);
            res.send(result)
        })

        // -----------classes---------------:
        app.get("/classes", async (req, res) => {
            const query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await classesCollection.find(query).toArray();
            res.send(result)
        })

        app.get("/classes/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await classesCollection.findOne(query);
            res.send(result)
        })

        app.post("/classes", async (req, res) => {
            const classes = req.body;
            const result = await classesCollection.insertOne(classes);
            res.send(result)
        })

        app.delete("/classes/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await classesCollection.deleteOne(query);
            res.send(result)
        })


        // ------------------sessions-------------------:
        app.get("/sessions", async (req, res) => {
            const query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await sessionsCollection.find(query).toArray();
            res.send(result)
        })

        app.get("/sessions/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await sessionsCollection.findOne(query);
            res.send(result)
        })

        app.post("/sessions", async (req, res) => {
            const sessions = req.body;
            const result = await sessionsCollection.insertOne(sessions);
            res.send(result)
        })

        app.delete("/sessions/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await sessionsCollection.deleteOne(query);
            res.send(result)
        })

        app.patch("/sessions/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const session = req.body;
            const updatedDoc = {
                $set: {
                    title: session.title,
                    sessionBanner: session.sessionBanner,
                    sessionDate: session.sessionDate,
                    sessionPlatform: session.sessionPlatform,
                    sessionLink: session.sessionLink,
                    sessionTime: session.sessionTime,
                }
            }
            const result = await sessionsCollection.updateOne(query, updatedDoc);
            res.send(result)
        })


        // ------------------blogs---------------------:
        app.get("/blogs", async (req, res) => {
            const query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await blogsCollection.find(query).toArray();
            res.send(result)
        })

        app.get("/blogs/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query);
            res.send(result)
        })

        app.post("/blogs", async (req, res) => {
            const blogs = req.body;
            const result = await blogsCollection.insertOne(blogs);
            res.send(result)
        })

        app.delete("/blogs/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.deleteOne(query);
            res.send(result)
        })

        app.patch("/blogs/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const blog = req.body;
            const updatedDoc = {
                $set: {
                    title: blog.title,
                    blogBanner: blog.blogBanner,
                    description: blog.description,
                }
            }
            const result = await blogsCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.patch("/blogsLike/:id", async (req, res) => {
            const id = req?.params?.id;
            const filter = { _id: new ObjectId(id) }
            let like;
            if (req.query.NoOfLike) {
                like = { NoOfLike: req.query.NoOfLike }
            }
            const updatedDoc = {
                $set: {
                    NoOfLike: like,
                }
            }
            const result = await blogsCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })

        // ------------------users------------------:
        app.get("/users", async (req, res) => {
            const query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        app.get("/users/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        app.get("/users/role/:email", async (req, res) => {
            const email = req?.params?.email;
            const query = { email: email }
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result)
        })

        app.delete("/users/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })

        app.patch("/users/:id", async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) }
            const user = req.body;
            const updatedDoc = {
                $set: {
                    name: user.name,
                    speciality: user.speciality,
                    phone: user.phone,
                    imageURL: user.imageURL,
                    gender: user.gender,
                    age: user.age,
                    nationality: user.nationality,
                    interests: user.interests,
                    skills: user.skills,
                    education: user.education,
                    address: user.address,
                }
            }
            const result = await sessionsCollection.updateOne(query, updatedDoc);
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

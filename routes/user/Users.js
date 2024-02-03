const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const usersCollection = client.db("eduCareSolutions").collection("users");

  router.get("/", async (req, res) => {
    const query = {};
    if (req.query.email) {
      query = { email: req.query.email };
    }
    const result = await usersCollection.find(query).toArray();
    res.send(result);
  });

  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.findOne(query);
    res.send(result);
  });

  router.get("/role/:email", async (req, res) => {
    const email = req?.params?.email;
    const query = { email: email };
    const result = await usersCollection.findOne(query);
    res.send(result);
  });

  router.post("/", async (req, res) => {
    const users = req.body;
    const result = await usersCollection.insertOne(users);
    res.send(result);
  });

  router.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  });

  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const user = req.body;
    const updatedDoc = {
      $set: {
        name: user.name,
        number: user.number,
        email: user.email,
        image: user.image,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        nid: user.nid,
        interest: user.interest,
        skills: user.skills,
        educationalQualifications: user.educationalQualifications,
        address: user.address,
      },
    };
    const result = await usersCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return router;
};

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const classesCollection = client.db("eduCareSolutions").collection("classes");

  // get all courses
  router.get("/", async (req, res) => {
    const result = await classesCollection.find().toArray();
    res.send(result);
  });

  // get my courses
  router.get("/myClass", async (req, res) => {
    const query = {};
    if (req.query.teacherEmail) {
      query.teacherEmail = req.query.teacherEmail;
    }
    const result = await classesCollection.find(query).toArray();
    res.send(result);
  });

  // get courses by id
  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await classesCollection.findOne(query);
    res.send(result);
  });

  // add course
  router.post("/", async (req, res) => {
    const classes = req.body;
    const result = await classesCollection.insertOne(classes);
    res.send(result);
  });

  // delete course
  router.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await classesCollection.deleteOne(query);
    res.send(result);
  });

  // update course
  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const classes = req.body;
    const updatedDoc = {
      $set: {
        title: classes.title,
        bannerURL: classes.bannerURL,
        videoURL: classes.videoURL,
        categoryId: classes.categoryId,
        categoryName: classes.categoryName,
        price: classes.price,
        description: classes.description,
      },
    };
    const result = await classesCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return router;
};

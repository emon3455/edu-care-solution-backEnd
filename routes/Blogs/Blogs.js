const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const blogsCollection = client.db("eduCareSolutions").collection("blogs");

  // to get all blogs
  router.get("/", async (req, res) => {
    const result = await blogsCollection.find().toArray();
    res.send(result);
  });
  // to get all my blogs
  router.get("/myBlogs", async (req, res) => {
    const query = {};
    if (req.query.teacherEmail) {
      query.teacherEmail = req.query.teacherEmail;
    }
    const result = await blogsCollection.find(query).toArray();
    res.send(result);
  });

  // get blogs by id
  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await blogsCollection.findOne(query);
    res.send(result);
  });

  // add blogs
  router.post("/", async (req, res) => {
    const blogs = req.body;
    const result = await blogsCollection.insertOne(blogs);
    res.send(result);
  });

  // delete blogs
  router.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await blogsCollection.deleteOne(query);
    res.send(result);
  });

  // blogs update
  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const blog = req.body;
    const updatedDoc = {
      $set: {
        title: blog.title,
        blogBanner: blog.blogBanner,
        description: blog.description,
      },
    };
    const result = await blogsCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return router;
};

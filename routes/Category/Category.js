const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const categoryCollection = client.db("eduCareSolutions").collection("categorys");

  // to get all categorys
  router.get("/", async (req, res) => {
    const result = await categoryCollection.find().toArray();
    res.send(result);
  });

  // get category by id
  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await categoryCollection.findOne(query);
    res.send(result);
  });

  // add category
  router.post("/", async (req, res) => {
    const category = req.body;
    const result = await categoryCollection.insertOne(category);
    res.send(result);
  });

  // update category
  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const category = req.body;
    const updatedDoc = {
      $set: {
        categoryName: category.categoryName,
      },
    };
    const result = await categoryCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  // delete category
  router.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await categoryCollection.deleteOne(query);
    res.send(result);
  });

  return router;
};

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const usersCollection = client.db("eduCareSolutions").collection("users");

  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const user = req?.body;
    const updatedDoc = {
      $set: {
        roles: user.roles,
      },
    };
    const result = await usersCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return router;
};

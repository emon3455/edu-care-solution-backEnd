const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const paymentsCollections = client
    .db("eduCareSolutions")
    .collection("payments");

  // get Enrolled Class:
  router.get("/", async (req, res) => {
    const email = req.query.email;

    if (!email) {
      res.send([]);
    }

    const query = { studentEmail: email };
    const result = await paymentsCollections
      .find(query)
      .sort({ date: -1 })
      .toArray();
    res.send(result);
  });

  // get enrolled class by id:
  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await paymentsCollections.findOne(query);
    res.send(result);
  });

  return router;
};

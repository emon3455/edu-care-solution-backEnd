const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const classesCollection = client.db("eduCareSolutions").collection("classes");
  const paymentsCollections = client
    .db("eduCareSolutions")
    .collection("payments");

  router.post("/", async (req, res) => {
    const payment = req.body;
    const insertedResult = await paymentsCollections.insertOne(payment);

    const updateQuery = { _id: new ObjectId(payment.classId) };
    const paidClass = await classesCollection.findOne(updateQuery);
    const updatedDoc = {
      $set: {
        totalstu: paidClass.totalstu + 1,
      },
    };
    const updateResult = await classesCollection.updateOne(
      updateQuery,
      updatedDoc
    );

    res.send({ insertedResult, updateResult });
  });

  return router;
};

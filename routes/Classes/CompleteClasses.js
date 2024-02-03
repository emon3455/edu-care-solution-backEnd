const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const paymentsCollections = client
    .db("eduCareSolutions")
    .collection("payments");

  router.put("/", async (req, res) => {
    try {
      const { id, classId } = req?.body;

      await paymentsCollections.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { isCompleted: true } }
      );

      res.status(200).json({ message: "Course marked as watched." });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};

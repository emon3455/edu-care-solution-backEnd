const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const paymentsCollections = client
    .db("eduCareSolutions")
    .collection("payments");
  const classesCollection = client.db("eduCareSolutions").collection("classes");

  router.put("/", async (req, res) => {
    try {
      const { classId, rating, id } = req.body;

      // Update the payment collection to mark the course as rated
      await paymentsCollections.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isRated: true, yourRatting: parseFloat(rating) } }
      );

      // Find the course document
      const course = await classesCollection.findOne({
        _id: new ObjectId(classId),
      });

      const totalstu = course.completedstu + 1;

      let newRating;

      if (course.completedstu > 0) {
        const totalRating =
          course.rating * course.completedstu + parseFloat(rating);
        newRating = totalRating / totalstu;
      } else {
        newRating = parseFloat(rating);
      }

      // Update the course document with the new rating and completed students count
      await classesCollection.updateOne(
        { _id: new ObjectId(classId) },
        { $set: { rating: newRating, completedstu: totalstu } }
      );

      res.status(200).json({ message: "Course rated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};

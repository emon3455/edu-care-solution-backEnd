const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const classesCollection = client.db("eduCareSolutions").collection("classes");
  const usersCollection = client.db("eduCareSolutions").collection("users");

  router.get("/:email", async (req, res) => {
    try {
      const email = req.params.email;

      // Step 1: Get User's Interests
      const user = await usersCollection.findOne({ email: email });

      const userInterests = user.interest;

      // Step 2: Find Matching Courses
      const suggestedCourses = await classesCollection
        .find({ categoryName: { $in: userInterests } })
        .toArray();

      const sortedSuggestedCourses = suggestedCourses.sort(
        (a, b) => b.rating - a.rating
      );
      res.json(sortedSuggestedCourses);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};

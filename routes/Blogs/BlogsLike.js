const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const blogsCollection = client.db("eduCareSolutions").collection("blogs");
  const usersCollection = client.db("eduCareSolutions").collection("users");

  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const filter = { _id: new ObjectId(id) };
    let like;

    if (req.query.NoOfLike) {
      like = parseInt(req.query.NoOfLike);
    }

    // Extract email from the query parameters
    const likedUserEmail = req.query.email;

    if (!likedUserEmail) {
      return res.status(400).send("Email is required for liking.");
    }

    try {
      const existingBlog = await blogsCollection.findOne(filter);

      // Check if the user has already liked
      const userAlreadyLiked =
        existingBlog.likedUsers &&
        existingBlog.likedUsers.some((user) => user.email === likedUserEmail);

      if (userAlreadyLiked) {
        // User has already liked, so remove the like
        const updatedDoc = {
          $set: {
            NoOfLike: like,
          },
          $pull: {
            likedUsers: { email: likedUserEmail },
          },
        };

        try {
          const result = await blogsCollection.updateOne(filter, updatedDoc);
          res.send(result);
        } catch (error) {
          res.status(500).send("Internal Server Error");
        }
      } else {
        // User has not liked, so add the like with additional user information
        const user = await usersCollection.findOne({ email: likedUserEmail });

        if (!user) {
          return res.status(404).send("User not found.");
        }

        const updatedDoc = {
          $set: {
            NoOfLike: like,
          },
          $push: {
            likedUsers: {
              email: likedUserEmail,
              name: user.name,
              image: user.image,
            },
          },
        };

        try {
          const result = await blogsCollection.updateOne(filter, updatedDoc);
          res.send(result);
        } catch (error) {
          res.status(500).send("Internal Server Error");
        }
      }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  });

  return router;
};

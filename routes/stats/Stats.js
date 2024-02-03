const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const classesCollection = client.db("eduCareSolutions").collection("classes");
  const usersCollection = client.db("eduCareSolutions").collection("users");
  const blogsCollection = client.db("eduCareSolutions").collection("blogs");
  const sessionsCollection = client
    .db("eduCareSolutions")
    .collection("sessions");

  router.get("/", async (req, res) => {
    const classes = await classesCollection.find().toArray();
    const sessions = await sessionsCollection.find().toArray();
    const blogs = await blogsCollection.find().toArray();
    const users = await usersCollection.find().toArray();
    const teacher = users.filter((user) => user?.roles === "Teacher");
    const student = users.filter((user) => user?.roles === "Student");

    const result = {
      noOfCourse: classes.length,
      noOfSessions: sessions.length,
      noOfBlogs: blogs.length,
      noOfUsers: users.length,
      noOfTeacher: teacher.length,
      noOfStudent: student.length,
    };

    res.send(result);
  });

  return router;
};

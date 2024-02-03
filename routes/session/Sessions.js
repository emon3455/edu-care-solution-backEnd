const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
module.exports = function (client) {
  const sessionsCollection = client
    .db("eduCareSolutions")
    .collection("sessions");

  //to get all session
  router.get("/", async (req, res) => {
    const result = await sessionsCollection.find().toArray();
    res.send(result);
  });

  // to get all my session
  router.get("/mySessions", async (req, res) => {
    const query = {};
    if (req.query.teacherEmail) {
      query.teacherEmail = req.query.teacherEmail;
    }
    const result = await sessionsCollection.find(query).toArray();
    res.send(result);
  });

  // get session by id
  router.get("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await sessionsCollection.findOne(query);
    res.send(result);
  });

  // add session
  router.post("/", async (req, res) => {
    const sessions = req.body;
    const result = await sessionsCollection.insertOne(sessions);
    res.send(result);
  });

  // delete sessions
  router.delete("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await sessionsCollection.deleteOne(query);
    res.send(result);
  });

  // update sessions
  router.patch("/:id", async (req, res) => {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const session = req.body;
    const updatedDoc = {
      $set: {
        title: session.title,
        sessionBanner: session.sessionBanner,
        sessionDate: session.sessionDate,
        sessionPlatform: session.sessionPlatform,
        sessionLink: session.sessionLink,
        sessionTime: session.sessionTime,
        teacherName: session.teacherName,
        teacherEmail: session.teacherEmail,
      },
    };
    const result = await sessionsCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return router;
};

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

module.exports = function (client) {
  router.post("/", (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.send({ token });
  });

  return router;
};

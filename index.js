const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middle ware:
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ error: true, message: "Unauthorized User" });
  }

  const token = authorization.split(" ")[1];

  console.log("Received token:", token); // Log the received token

  // Verifying:
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.error("Token verification error:", error); // Log verification error
      return res
        .status(403)
        .send({ error: true, message: "Unauthorized User" });
    }

    console.log("Decoded email:", decoded?.email); // Log decoded email

    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyyhzcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    // -----authentication-------
    const JwtRoutes = require("./routes/auth/Jwt")(client);
    app.use("/jwt", JwtRoutes);

    // -----------category--------------:
    const CategoryRoutes = require("./routes/Category/Category")(client);
    app.use("/categorys", CategoryRoutes);

    // -----------classes---------------:
    const ClassesRoutes = require("./routes/Classes/Classes")(client);
    app.use("/classes", ClassesRoutes);

    // ------------------sessions-------------------:
    const SessionsRoutes = require("./routes/session/Sessions")(client);
    app.use("/sessions", SessionsRoutes);

    // ------------------blogs---------------------:
    const BlogsRoutes = require("./routes/Blogs/Blogs")(client);
    app.use("/blogs", BlogsRoutes);

    const BlogsLikeRoutes = require("./routes/Blogs/BlogsLike")(client);
    app.use("/blogsLike", BlogsLikeRoutes);

    // ------------------users------------------:
    const UsersRoutes = require("./routes/user/Users")(client);
    app.use("/users", UsersRoutes);

    const UsersRoleRoutes = require("./routes/user/UsersRole")(client);
    app.use("/usersRole", UsersRoleRoutes);

    // -----------suggested course-----------
    const SuggestedCourseRoutes = require("./routes/Classes/SuggestedCourse")(client);
    app.use("/getSuggestedCourses", SuggestedCourseRoutes);

    // ---------stats---------------
    const StatsRoutes = require("./routes/stats/Stats")(client);
    app.use("/stats", StatsRoutes);

    // --------------payment-------------

    //---- creating payment intent
    const PaymentIntentRoutes = require("./routes/payment/PaymentIntent")(client);
    app.use("/create-payment-intent", PaymentIntentRoutes);

    //---- payment api:
    const PaymentRoutes = require("./routes/payment/Payment")(client);
    app.use("/payments", PaymentRoutes);

    //---- get Enrolled Class:
    const EnrolledClassesRoutes = require("./routes/Classes/EnrolledClasses")(client);
    app.use("/enrolledClasses", EnrolledClassesRoutes);

    //--- Route to handle completion of a course
    const CompleteClassesRoutes = require("./routes/Classes/CompleteClasses")(client);
    app.use("/complete", CompleteClassesRoutes);

    //--- Route to handle rating a course
    const RateClassesRoutes = require("./routes/Classes/RateClasses")(client);
    app.use("/rate", RateClassesRoutes);

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Edu-Care Soltuion network is running...");
});

app.listen(port, (req, res) => {
  console.log(`Edu-Care Soltuion API is running on port: ${port}`);
});

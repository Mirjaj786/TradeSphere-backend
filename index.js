require("dotenv").config();
const isProd = process.env.NODE_ENV === "production";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("./model/usersModel.js");
const passport = require("passport");
const LocalStragy = require("passport-local");

const userRoute = require("./Router/user.js");
const holdingRoute = require("./Router/holding.js");
const PositionRoute = require("./Router/position.js");
const orderRoute = require("./Router/order.js");

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URL;

const app = express();

// CORS
const corsOptions = {
  origin: [process.env.FRONTEND_LINK, process.env.DASHBOARD_LINK],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// Express JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store
const store = MongoStore.create({
  mongoUrl: MONGO_URI,
  collectionName: "sessions",
  touchAfter: 24 * 3600,
});

app.use(
  session({
    secret:
      process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
    name: "sessionId",
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/auth", userRoute);
app.use("/", holdingRoute);
app.use("/", PositionRoute);
app.use("/", orderRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Connect DB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error(" MongoDB connection error:", err));

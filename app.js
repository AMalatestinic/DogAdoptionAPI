const express = require("express");
const routes = require("./routes/routes");
const { connectToDb } = require("./db");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middlewares/middleware");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests
  message: "Too many requests from this IP, please try again later.",
});

app.use(cors());
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(checkUser);

connectToDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("App listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });

// app.get("/", (req, res) => res.render("home"));
app.use(routes);

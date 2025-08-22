const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

// const debugMiddleware = (req, res, next) => {
//   console.log("🔍 Request Object Properties:");
//   console.log("- Method:", req.method);
//   console.log("- URL:", req.url);
//   console.log("- Headers:", req.headers);
//   console.log("- Headers:", req.headers["authorization"]);
//   console.log("- Body:", req.body);
//   console.log("- Query:", req.query);
//   console.log("- Params:", req.params);

//   next();
// };

// app.use(debugMiddleware);

// app.get("/test", (req, res) => {
//   res.json({ message: "Check your console!" });
// });

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port http://localhost:${PORT}`
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

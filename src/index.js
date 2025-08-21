const app = require("express")();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

dotenv.config();

const PORT = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      `Server is Successfully Running, and App is listening on port http://localhost:${PORT}`
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

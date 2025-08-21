const router = require("express").Router();

const connection = require("../config/database");

// GET
router.get("/", (req, res) => {
  connection.query("SELECT * FROM users ORDER BY id asc", (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error`",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Users list",
        data: rows,
      });
    }
  });
});

module.exports = router;

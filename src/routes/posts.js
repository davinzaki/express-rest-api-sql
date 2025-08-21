const router = require("express").Router();
const { body, validationResult } = require("express-validator");

// import db
const connection = require("../config/database");

// GET
router.get("/", (req, res) => {
  // query
  connection.query("SELECT * FROM posts ORDER BY id desc", (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    } else {
      console.log("rows", rows);
      return res.status(200).json({
        status: true,
        message: "List Data Posts",
        data: rows,
      });
    }
  });
});

// POST
router.post(
  "/",
  // validation
  [(body("title").notEmpty(), body("content").notEmpty())],
  (req, res) => {
    const errors = validationResult(req);

    // isEmpty refers to array() value,is it empty or not, if empty = false vice versa

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    let formData = {
      title: req.body.title,
      content: req.body.content,
    };

    connection.query("INSERT INTO posts SET ?", formData, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        console.log(rows);
        return res.status(201).json({
          status: true,
          message: "Insert Data Successfully",
          data: { id: rows.insertId, ...formData },
        });
      }
    });
  }
);

// GET ID
router.get("/:id", (req, res) => {
  let id = req.params.id;

  connection.query(`SELECT * FROM posts WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    // if post not found
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Data Post Not Found!",
      });
    }
    // if post found
    else {
      return res.status(200).json({
        status: true,
        message: "Detail Data Post",
        data: rows[0],
      });
    }
  });
});

// patch

router.put(
  "/:id",
  [body("title").notEmpty(), body("content").notEmpty()],
  (req, res) => {
    let id = req.params.id;

    console.log(req);
    const errors = validationResult(req);
    console.log(errors.isEmpty(), !errors.isEmpty());

    // isEmpty refers to array() value,is it empty or not, if empty = false vice versa
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array(),
      });
    }

    const formData = {
      title: req.body.title,
      content: req.body.content,
    };

    connection.query(
      "UPDATE posts SET ? WHERE id = ?",
      [formData, id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        } else {
          console.log(rows);
          return res.status(200).json({
            status: true,
            message: "Update Data Successfully!",
            data: { id: parseInt(id), ...formData },
          });
        }
      }
    );
  }
);

// delete

router.delete("/:id", (req, res) => {
  let id = req.params.id;

  connection.query("DELETE FROM posts WHERE id = ?", [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }

    // if post not found
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: "Data Post Not Found!",
      });
    }
    // if post found
    else {
      return res.status(200).json({
        status: true,
        message: "Success delete data",
      });
    }
  });
});

module.exports = router;

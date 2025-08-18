let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_express_api",
});

connection.connect((error) => {
  if (!!error) {
    console.log("Connection error");
  } else {
    console.log("Connection success");
  }
});

module.exports = connection;

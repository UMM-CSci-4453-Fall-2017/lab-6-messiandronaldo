var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";
var connection = mysql.createConnection(credentials);

// create the connection
connection.connect(function(err){
  if(err){
    console.log("Problems with MySQL: "+err);
  } else {
    console.log("Connected to Database.");
  }
});

connection.query('SHOW DATABASES',function(err,rows,fields) {
  var dbs;
  if(err){
    console.log('Error looking up databases');
  } else {
    dbs = rows;
    for (var i = 0; i < dbs.length; i++) {
      var db = dbs[i]['Database'];
      console.log(db);
      connection.query('SHOW TABLES from ' + db, function(err, rows, fields) {
        if (err) {
          console.log('Error looking up a table');
        } else {
          console.log(rows);
        }
      });
    }
    connection.end();

  }
});

//connection.end();
console.log("All done now.");

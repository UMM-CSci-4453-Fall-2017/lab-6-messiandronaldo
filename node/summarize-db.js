var credentials = require('./credentials.json');

var mysql=require("mysql");
var asy =require("async");

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

connection.query('Show databases', function (err,rows,fields) {
  // for each db
  asy.each(rows, function (db, callback1) {
    connection.query('Show tables from ' + db['Database'], function (err,rows,fields) {
      // for each table
      asy.each(rows, function (table, callback2) {
        console.log('describe ' + db['Database'] + '.' + table['Tables_in_' + db['Database']]);
        connection.query('describe ' + db['Database'] + '.' + table['Tables_in_' + db['Database']] + ';', function (err,rows,fields) {
          console.log(rows);
        });
        callback2();
      }, function (err) {
        if (err) {
          console.log("Sth is wrong accesing tables");
        } else {
          console.log("Good");
          callback1();
        }
        // connection.end();
      });
    });
  }, function (err) {
    if (err) {
      console.log("Something is wrong accessing db names");
    } else {
      console.log("Gucci");
       connection.end();
    }
  });
});

console.log("All done now.");

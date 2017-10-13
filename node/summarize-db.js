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

// .query(queryString, cb)
var formatData = {};

function handler() {
    connection.query("show databases", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            handleDBs(rows, rows.length);
        }
    });
}

function handleDBs(dbs, dbNums) {
    var dbCount = 0;
    dbs.forEach(function (db) {
        formatData[db["Database"]] = {};
        connection.query("show tables from " + db["Database"], function(err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                dbCount++;
                handleTables(db, rows, rows.length, dbCount == dbNums);
            }
        });
    });
}

function handleTables(db, tables, tableNums, dbReady) {
    var tableCount = 0;
    tables.forEach(function (table) {
        formatData[db["Database"]][db["Database"] + '.' + table["Tables_in_"+db["Database"]]] = null;
        connection.query("describe " + db["Database"] + '.' + table["Tables_in_"+db["Database"]], function(err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                tableCount++;
                handleDes(db, table, rows);
                if (dbReady && tableCount == tableNums) {
                    connection.end();
                    console.log(formatData);
                }
            }
        });
    });
}

function handleDes(db, table, des) {
    // console.log(db);
    // console.log(table);
    // console.log(des);
    formatData[db["Database"]][db["Database"] + '.' + table["Tables_in_"+db["Database"]]] = des;
}

handler();

console.log("End");

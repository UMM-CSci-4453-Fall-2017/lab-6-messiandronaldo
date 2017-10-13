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

// .query(queryString, cb)
var formatData = {};

function handler() {
    connection.query("show databases", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log("\tAcquiring data.  This may take a bit...");
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
                    dataPrint();
                }
            }
        });
    });
}

function handleDes(db, table, des) {
    formatData[db["Database"]][db["Database"] + '.' + table["Tables_in_"+db["Database"]]] = des;
}


function dataPrint(){
  var dbs = Object.keys(formatData);
  for(var i = 0; i < dbs.length; i++ ){
    var db = dbs[i];
    console.log("---|"+db+">");
    var tables = Object.keys(formatData[db]);
    for(var j = 0; j < tables.length; j++){
      var table = tables[j];
      console.log("......|"+db+"."+table+">");
      var fields = formatData[db][table];
        for(var x = 0; x < fields.length; x++){
          var field = fields[x];
          console.log("\tFieldName: `"+field["Field"]+"`\t"+field["Type"] );
        }
    }
  }
}

handler();

console.log("End");

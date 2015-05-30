
var yargs = require('yargs')
    .alias('?', 'help')
    .alias('f', 'file')
    .describe('f', 'gnucash sqlite3 database file')
    .usage('Usage: $0 -f [gnucash file]')
    .default({
        help: false
    });
var argv = yargs.argv;
if (argv.help) {
    yargs.showHelp();
    return;
}
console.log(argv.file);
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');
var sqlite = require('sqlite3').verbose();

var file = path.resolve(argv.file);
if( fs.existsSync(file) ){
	db(file, selectValues);
}

// http://blog.modulus.io/nodejs-and-sqlite
function selectValues(err, db){
  db.each("SELECT *  FROM accounts;", function(err, row) {
    console.log(row);
  });
}
function db(file, callback){
	var db = new sqlite.Database(file);
	callback(undefined, db);
}



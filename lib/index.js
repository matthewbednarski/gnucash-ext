var yargs = require('yargs')
    .alias('?', 'help')
    .alias('f', 'file')
    .describe('f', 'gnucash sqlite3 database file')
    .alias('l', 'list')
    .describe('l', 'list tables and table\'s structure')
    .usage('Usage: $0 -f [gnucash file] -l')
    .default({
        help: false,
        list: false
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
var q = require('q');

var file = path.resolve(argv.file);
if (fs.existsSync(file)) {
    if (argv.list) {
        db(file, listTables);
    }
}

function listTables(err, db) {
        var defer = q.defer();
        // db.each("SELECT name FROM sqlite_master WHERE type='table';", function(err, row) {
        db.all("SELECT name FROM sqlite_master WHERE type='table';", function(err, rows) {
            var rowName = undefined;
            var promises = _.chain(rows)
                .map(function(row) {
                    var d = q.defer();
                    db.all("PRAGMA table_info(" + row.name + ");", function(err, tInfos) {
                    	row.infos = JSON.stringify(tInfos);
                        d.resolve(tInfos);
                    });
                    return d.promise;
                })
                .value();
            q.all(promises).then(function(result) {
                defer.resolve(rows);
            });
        });
        return defer.promise;
    }
    // http://blog.modulus.io/nodejs-and-sqlite

function selectValues(err, db) {
    db.each("SELECT *  FROM accounts;", function(err, row) {
        console.log(row);
    });
}

function db(file, callback) {
    var db = new sqlite.Database(file);
    var p = callback(undefined, db);
    p.then(function(tables) {
        console.log(tables);
    });
}

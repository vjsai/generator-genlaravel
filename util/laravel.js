var https = require('https'),
    fs = require('fs'),
    path = require('path'),
    mysql = require('mysql'),
    exec = require('child_process').exec,
    git = require('./git'),
    EventEmitter = require('events').EventEmitter,
    laravelRepo = "git://github.com/laravel/laravel.git";




function loadConfig() {
    var ee = new EventEmitter();

    function readConfig(path) {
        fs.readFile(path, {encoding:'utf8'}, function(err, contents) {
            if (err) return ee.emit('error', err);
            ee.emit('done', contents);
        });
    }

    fs.exists('dbconfig.php', function(exists) {
        if (exists) {
            readConfig('dbconfig.php');
        } else {
            fs.exists('../dbconfig.php', function(exists) {
                if (exists) {
                    readConfig('../dbconfig.php');
                } else {
                    ee.emit('error', 'Config file does not exist.');
                }
            });
        }
    });

    return ee;
};

function getDbCredentials() {
    var ee = new EventEmitter();

    loadConfig().on('done', function(contents) {
        var db    = {};
        db.name   = contents.match(/define\(["']DB_NAME["'],[\s]*["'](.*)["']\)/)[1];
        db.user   = contents.match(/define\(["']DB_USER["'],[\s]*["'](.*)["']\)/)[1];
        db.pass   = contents.match(/define\(["']DB_PASSWORD["'],[\s]*["'](.*)["']\)/)[1];
        db.host   = contents.match(/define\(["']DB_HOST["'],[\s]*["'](.*)["']\)/)[1];

        ee.emit('done', db);
    }).on('error', function(err) {
            ee.emit('error', err);
        });

    return ee;
};

function createDBifNotExists(callback) {
    var ee = new EventEmitter();

    getDbCredentials().on('done', function(db) {

        var connection = mysql.createConnection({
            host     : db.host,
            user     : db.user,
            password : db.pass
        });

        connection.connect(function(err) {
            if (err) return ee.emit('error', err);

            connection.query('CREATE DATABASE IF NOT EXISTS ' + mysql.escapeId(db.name), function(err, rows, fields) {
                if (err) return ee.emit('error', err);
                connection.end(function() {
                    ee.emit('done');
                });
            });

        });

    }).on('error', function(err) {
            ee.emit('error', err);
        });

    if (typeof callback === 'function') {
        ee.on('done', callback);
    }

    return ee;
};

function getComposer()
{
    var ee = new EventEmitter();
    var child;

    child = exec('curl -sS https://getcomposer.org/installer | php',
        function (error, stdout, stderr) {
            if(stdout!==null)
            {
                //console.log('stdout: ' + stdout);
                ee.emit('done',stdout);
            }
            else
            {
               // console.log('stderr: ' + stderr);
                ee.emit('error',stderr);
            }
            if (error !== null) {
                  ee.emit('error',error);
                //console.log('exec error: ' + error);
            }
        });
    return ee;
}

function checkInDefaultPath()
{
  var file = "/usr/local/bin/composer";
  var ee = new EventEmitter();
  fs.exists(file, function(exists) {
     if (exists) {
         ee.emit('done',true);
     } else {
         ee.emit('error',false);
    }
  });
    return ee;
  
}

function checkComposer(file)
{
  var ee = new EventEmitter();
  fs.exists(file, function(exists) {
     if (exists) {
         ee.emit('done',true);
     } else {
         ee.emit('error',false);
    }
});
    return ee;
}


function installComposer()
{
         var ee = EventEmitter();
         getComposer();
        return ee;
}




module.exports = {
    repo : laravelRepo,
    getDbCredentials : getDbCredentials,
    createDBifNotExists : createDBifNotExists,
    loadConfig : loadConfig,
    getComposer : getComposer,
    checkComposer : checkComposer,
    defaultComposer : checkInDefaultPath
};

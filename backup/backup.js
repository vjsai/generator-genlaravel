'use strict';
var util         = require('util'),
    fs           = require('fs'),
    path         = require('path'),
    yeoman       = require('yeoman-generator'),
    wrench       = require('wrench'),
    git          = require('../util/git'),
    prompt       = require('../util/prompt'),
    laravel    = require('../util/laravel'),
    spawn        = require('../util/spawn'),
    art          = require('../util/art'),
    exec         = require('child_process').exec,
    prompts      = require('./prompts');


var GenlaravelGenerator = module.exports = function GenlaravelGenerator(args, options, config) {

    yeoman.generators.Base.apply(this, arguments);
    if (typeof options.advanced !== 'undefined' && options.advanced) {
        prompt.advanced();
    }
    if (options.hasOwnProperty('verbose') && options.verbose) {
        this.verbose = true;
    } else {
        this.verbose = false;
    }

    // TODO :: check last char is /
    this.destinationRoot(this.name);
    this.composer = false;

    this.logging = function (message, needed) {
        if (this.verbose || needed) {
            console.log(message);
        }
    };
    this.info = function (message, force) {
        if (this.verbose || force) {
            this.log.info(message);
        }
    };
    this.conflict = function (message, force) {
        if (this.verbose || force) {
            this.log.conflict(message);
        }
    };
};

util.inherits(GenlaravelGenerator, yeoman.generators.Base);

GenlaravelGenerator.prototype.AskUser = function() {

    // Display welcome message
    console.log(art.lar);

    // Get the input
    getInput.call(this, this.async());

};

GenlaravelGenerator.prototype.checkoutLaravel = function() {

    var done = this.async(),
        me   = this;

    if (this.userInput.submodule) {

        git.submoduleAdd(laravel.repo, this.userInput.larDir, function() {
            var cwd = process.cwd();
            process.chdir(me.userInput.larDir);
            git.checkout([me.userInput.larVer], function() {
                process.chdir(cwd);
                done();
            });
        });

    } else {

        //console.log("test".cyan);
        this.remote('laravel', 'laravel', function(err, remote) {
            remote.directory('.', me.userInput.larDir);
            done();
        });

    }

};
//Installing composer
GenlaravelGenerator.prototype.installComposer = function(){
    var done = this.async(),
        child,
        me = this;
    console.log("Started Downloading composer");
    var cwd = process.cwd();
    process.chdir(me.userInput.larDir);
    laravel.getComposer().on('done',function(){
        child = exec('cp composer.phar laravel',
            function (error, stdout, stderr) {
                if(stdout!==null)
                {
                    console.log('stdout: ' + stdout);
                    var sub_child = exec("php composer.phar install",function(error,stdout,stdin)
                    {
                        if(stdout!==null)
                        {
                            console.log("stdout :"+stdout);
                            process.chdir(cwd);

                        }else{
                            console.log("stderr :"+stdin);
                        }
                        if(error!==null)
                        {
                            console.log("exec error"+error);
                        }

                    });
                }
                else
                {
                    console.log('stderr: ' + stderr);
                }
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    });
    done();

}

GenlaravelGenerator.prototype.startLaravel = function()
{
    var done = this.async(),
        me = this,
        child;
    var cwd = process.cwd();
    process.chdir(me.userInput.larDir);
    console.log("Starting laravel");
    child = exec("php artisan serve",function(error,stdout,stdin){
        if(stdout!==null){
            console.log("stdout :"+stdout);
            process.chdir(cwd);
        }else{
            console.log("stdin :"+stdin);
        }
        if(error!=null){
            console.log("error :"+error);
        }
        //process.chdir(cwd);
    });
    done();

}

GenlaravelGenerator.prototype.initialiseGit = function() {

    // Intiate Git
    if (this.userInput.useGit) {

        var done = this.async();

        git.init(function() {
            git.addAllAndCommit('Initial Commit', function() {
                done();
            });
        });
    }

};

function getInput(done) {
    var me = this;
    promptForData.call(me, function(input) {
        me.userInput = input;
        confirmInput.call(me, done);
    });
};

var promptForData = function(done) {

    // All the data will be attached to this object
    var input = {},
        me = this;
    input.larVer = '4';
    input.larDir = "laravel";

    prompt([
        prompts.url,
        prompts.tablePrefix,
        prompts.dbHost,
        prompts.dbName,
        prompts.dbUser,
        prompts.dbPass,
        prompts.larVer,
        prompts.useGit,
        prompts.larDir
    ], input, function(i) {
        var port = i.url.match(/:[\d]+$/);
        if (port !== null) {
            input.port = port[0];
        } else {
            input.port = '';
        }
        done(input);
    });
    // done(input);
}

GenlaravelGenerator.prototype.checkComposer = function checkComposer() {
    var cb = this.async();

    this.info('Check composer install'.cyan);
    var composer = spawn('composer'),
        self = this;

    composer.stdout.on('data', function () {
        self.info('Composer has been found'.green);
        self.composer = true;
        cb();
    });

    composer.stderr.on('data', function () {
        self.conflict('Composer is missing'.red, true);
        // Composer doesn't exist
    });
    return false;
};

GenlaravelGenerator.prototype.allDone = function() {
    console.log('All Done!!'.green);
};



function confirmInput(done) {

    var me  = this;

    console.log('\n----------------------------'.red);

    logConfirmation('Laravel URL', this.userInput.url);
    logConfirmation('Database host', this.userInput.dbHost);
    logConfirmation('Database name', this.userInput.dbName);
    logConfirmation('Database user', this.userInput.dbUser);
    logConfirmation('Database password', this.userInput.dbPass);
    logConfirmation('Laravel version', this.userInput.larVer);
    logConfirmation('Laravel install directory', this.userInput.larDir);

    console.log('----------------------------'.red);

    prompt([prompts.correct], null, function(input) {
        if (!input.correct) {
            console.log(art.oops);
            getInput.call(me, done);
        } else {
            console.log(art.go);
            done();
        }
    });

};

function logConfirmation(msg, val) {
    console.log(msg.bold.grey + ': '.bold.grey + val+"".cyan);
};
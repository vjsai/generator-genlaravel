/**
 * Created with JetBrains WebStorm.
 * User: vijay
 * Date: 24/8/13
 * Time: 11:56 AM
 * To change this template use File | Settings | File Templates.
 */
// Boolean answer regexp
var boolRegex = /^(?:y(?:es)?|n(?:o)?)$/i,
    boolFilter = function(value) {
        value = value.toLowerCase();
        if (value === 'y' || value === 'yes') return true;
        return false;
    };

module.exports = {

    url : {
        name : 'url',
        description : 'URL where Laravel will be installed at (ex. example.com):',
        required : true,
        before : function(value) {
            value = value.replace(/\/+$/g, '');
            if (!/^http[s]?:\/\//.test(value)) {
                value = 'http://' + value;
            }
            return value;
        }
    },
    dbHost : {
        name : 'dbHost',
        description : 'Database host:',
        required : true,
        default : 'localhost'
    },
    
    secretKey : {
        name : 'secretKey',
        description : 'Generate an encryption key for app.php?',
        default : 'Y',
        pattern : boolRegex,
        before : boolFilter
    },

    dbName : {
        name : 'dbName',
        description : 'Database name:',
        required : true
    },

    dbUser : {
        name : 'dbUser',
        description : 'Database user:',
        required : true,
        default : 'root'
    },

    dbPass : {
        name : 'dbPass',
        description : 'Database password:',
        default : ''
    },

    useGit : {
        name : 'useGit',
        description : 'Use Git?',
        default : 'N',
        pattern : boolRegex,
        before : boolFilter
    },

    larDir : {
        name : 'larDir',
        description : 'Laravel install directory:',
        required : true,
        default : 'laravel'
    },
    larVer : {
        name : 'larVer',
        description : 'Laravel Version:',
        required : true,
        advanced : true
    },

    correct : {
        name : 'correct',
        description : 'Does everything look correct?',
        default : 'Y',
        pattern : boolRegex,
        before : boolFilter
    },
    startServer : {
        name : 'startServer',
        description : 'Do you want to start the server?',
        default : 'Y',
        pattern : boolRegex,
        before : boolFilter
    },
    enableVagrant : {
		name : 'enableVagrant',
		description : 'enable Vagrant?',
		required : true,
		advanced : true,
		default : 'N',
		pattern : boolRegex,
		before : boolFilter
    }

};

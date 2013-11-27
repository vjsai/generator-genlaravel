'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var VagrantGenerator = module.exports = function VagrantGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the vagrant subgenerator with the argument ' + this.name + '.');
};

util.inherits(VagrantGenerator, yeoman.generators.NamedBase);

VagrantGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};

'use strict';
var angular = require('angular-cjs');
var linkHelper = require('./index');

module.exports = angular.module(linkHelper.moduleName, [])
  .value(linkHelper.entityName, linkHelper.factoryFn);

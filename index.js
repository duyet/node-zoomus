'use strict';

var _ = require('lodash');
var request = require('request');

var config = require('../../config/environment');
var Zoomus = require('./zoomus.model');

function commonError(resp) {
	console.log("Code:" + resp.errorCode + " Message:" + resp.errorMessage)
}

module.exports = require('./lib/zoomus.js');

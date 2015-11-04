'use strict';

var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ZoomusDataSchema = new Schema({
	user_id: Schema.Types.ObjectId,
	key: String,
	value: Schema.Types.Mixed
});

ZoomusDataSchema.plugin(timestamps);
ZoomusDataSchema.index({
	user_id: 1,
	key: 1
}, {
	unique: true
});

module.exports = mongoose.model('ZoomusData', ZoomusDataSchema);

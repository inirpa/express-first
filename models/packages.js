let mongoose = require('mongoose');

//Package Schema
let packagesSchema = mongoose.Schema({
	title:{
		type: String,
		required: true,
	},
	description:{
		type: String,
		required: true,
	},
	user_id:{
		type: String,
		required: true,
	}
});

let Packages = module.exports = mongoose.model('Packages', packagesSchema);
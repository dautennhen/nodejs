var MongoClient = require('mongodb').MongoClient, Logger = require('mongodb').Logger, assert = require('assert'), colors = require('colors');
var _ = require('underscore');
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var User = require('myapp/User');
/*--------------------------------------------*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');
var db = mongoose.connection;
var Schema = mongoose.Schema;

// create schema
var itemsSchema = new Schema({
		name : String,
		price : {
			type : String,
			required : true
		},
		currency : {
			type : String,
			required : true
		}
	});

var ordersSchema = new Schema({
		id : Number,
		params : String,
		status : String
	});

var ordersitemsSchema = new Schema({
		orderid : String,
		itemid : String
	});
//----------------------------------------

itemsSchema.methods.dudify = function () {
	// add some stuff to the users name
	this.name = this.name + '-dude';
	return this.name;
};
var modifyParams = function (schema) {
	schema.pre('save', function (next) {
		var currentDate = new Date();
		this.updated_at = currentDate;
		if (!this.created_at)
			this.created_at = currentDate;
		next();
	});
}

modifyParams(itemsSchema);
modifyParams(ordersSchema);
//modifyParams(ordersitemsSchema);

var itemsModel = mongoose.model('itemsModel', itemsSchema);
var ordersModel = mongoose.model('ordersModel', ordersSchema);
var ordersitemsModel = mongoose.model('ordersitemsModel', ordersitemsSchema);

var myapp = {
	open : function () {
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function (callback) {});
	},
	doParseList : function (model, data, callback) {
		myapp.open();
		model.find({}, function (err, list) {
			if (err)
				throw err;
			callback(list);
		});
	},
	doAddItem : function (model, data, callback) {
		myapp.open();
    var params = model.schema.tree;
    params = _.omit(params, 'id', '_id', '__v');
    data = _.mapObject(params, function(val, key) {
      return eval('data.'+key);
    });
		var item = new model(data);
		item.save(function (err) {
			callback(item);
		});
	},
	doDeleteItem : function (model, data, callback) {
		myapp.open();
		model.remove(data, function (err, numberRow) {
			callback({
				deleted : numberRow
			})
		});
	},
  gooUpdateItem : function (model, data, callback) {
		myapp.open();
    //data =  {like:{}, unlike:{}}
		itemsModel.findOneAndUpdate( data.unlike, data.like, function (err, user) {
			if (err)
				throw err;
			console.log(user);
		});
	},
  
	// Items
	gooParseList : function (data, callback) {
		myapp.doParseList(itemsModel, data, callback);
	},
	gooAddItem : function (data, callback) {
		myapp.doAddItem(itemsModel, data, callback);
	},
	gooDeleteItem : function (data, callback) {
    var data = {
			name : data.name
		}
		myapp.doDeleteItem(itemsModel, data, callback);
	},
	gooUpdateItem : function (data, callback) {
    callback({});
	},
  
  // Orders
	parseOrders : function (data, callback) {
		myapp.doParseList(ordersModel, data, callback);
	},
	addOrder : function (data, callback) {
		myapp.doAddItem(ordersModel, data, callback);
	},
	deleteOrder : function (data, callback) {
		var data = {
			_id : data.id
		}
		myapp.doDeleteItem(ordersModel, data, callback);
	},
	updateOrder : function (data, callback) {
		callback({});
	}
}
module.exports = myapp;

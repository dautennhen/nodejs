var MongoClient = require('mongodb').MongoClient, Logger = require('mongodb').Logger, assert = require('assert'), colors = require('colors');
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
  name: String,
  price: { type: String, required: true},
  currency: { type: String, required: true }
});

var ordersSchema = new Schema({
  id : Number,
  params: String,
  create_at: String,
  update_at: String,
  status : String
});

var ordersitemsSchema = new Schema({
  orderid: String,
  itemid: String
});

//----------------------------------------

itemsSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude';
  return this.name;
};

var modifyParams = function(schema){
  schema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
      this.created_at = currentDate;
    next();
  });
}

modifyParams(itemsSchema);
modifyParams(ordersSchema);
modifyParams(ordersitemsSchema);

var url = 'mongodb://localhost:27017/myproject';

var myapp = {
  open : function () {
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {});
	},
	parse : function (data, callback) {
		MongoClient.connect(url, function (err, db) {
			assert.equal(null, err);
			var col = db.collection('abc');
			 col.aggregate([
				  {$match: {}}
				 /*,{$group:
					{ _id: '$a', total: {$sum: '$a'} }
				  }*/
			  ]).toArray(function(err, docs) {
				  callback(docs)
				  ; db.close()
			})
		})
	},
  gooParseList : function (data, callback) {
    myapp.open();
    //console.log(this); return;
		itemsModel.find({}, function(err, users) {
      console.log('users', users)
      if (err) throw err;
        callback(users);
    });
	},
  gooAddItem : function (data, callback) {
   this.open();
   var data = {
      name: data.name,
      price: data.price,
      currency: data.currency
    }
		var auser = new itemsModel(data);
    auser.save(function(err) {
      console.log('Saved successfully!');
      callback(auser);
    });
	},
  gooUpdateItem : function (data, callback) { 
    this.open();
    itemsModel.findOneAndUpdate({ username: 'duongtang' }, { username: 'duong tam tang' }, function(err, user) {
    if (err) throw err;
    console.log(user);
    });
  },
  gooDeleteItem : function (data, callback) { 
    this.open();
    itemsModel.remove({ name: data.name }, function(err, numberRow) {
      callback({deleted:numberRow})
    });
  },
  addDummyData : function (data, callback) {
		MongoClient.connect(url, function (err, db) {
			var col = db.collection('abc');
      //var insertData = eval(data.data);
       //console.log( insertData );
       var data = [
                {a:'abc'},
                {a:'abc', b:'def'},
                {a:'query', b:'uiop'}
              ]
			; col.insertMany(data, function(err, r) {
			  //assert.equal(null, err)
			  //; assert.equal(1, r.insertedCount)
			  ; callback({inserted : r.insertedCount})
			  ; db.close()
			});
		});
	},
	addProduct : function (data, callback) {
		MongoClient.connect(url, function (err, db) {
			var col = db.collection('abc');
      //var insertData = eval(data.data);
       //console.log( insertData );
			; col.insertMany(data.data, function(err, r) {
			  //assert.equal(null, err)
			  //; assert.equal(1, r.insertedCount)
			  ; callback({status:"inserted"})
			  ; db.close()
			});
		});
	},
	deleteItem : function (data, callback) {
		MongoClient.connect(url, function (err, db) {
			var col = db.collection('abc')
      //; col.deleteOne({a:10}, function(err, r) {callback(r)})
      //var aValue = parseInt(data.id);
      //console.log(aValue);
			; col.deleteMany(
            { a: data.id },
            function(err, results) {
              console.log(results)
              ; callback({deleted:results.deletedCount})
              ; db.close()
            }
        )
		})
	},
	viewItem : function (data, callback) {
		MongoClient.connect(url, function (err, db) {
			var col = db.collection('abc')
      //; col.deleteOne({a:10}, function(err, r) {callback(r)})
      col.aggregate([
				  {$match: {a:data.id}}
				 /*,{$group:
					{ _id: '$a', total: {$sum: '$a'} }
				  }*/
			  ]).toArray(function(err, docs) {
				  console.log(docs)
          ; callback(docs)
				  ; db.close()
			})
      
		})
	}
}
var itemsModel = mongoose.model('itemsModel', itemsSchema);
var ordersModel = mongoose.model('ordersModel', ordersSchema);
var ordersitemsModel = mongoose.model('ordersitemsModel', ordersitemsSchema);
module.exports = myapp;
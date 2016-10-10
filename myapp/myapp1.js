var MongoClient = require('mongodb').MongoClient, Logger = require('mongodb').Logger, assert = require('assert'), colors = require('colors');
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//var User = require('myapp/User');
/*--------------------------------------------*/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');
var db = mongoose.connection;
var Schema = mongoose.Schema;
// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

userSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};

 // on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

/*
var auser = new User({
      name: 'Yourname',
      username: 'duongtang',
      password: 'tamtang' 
    });
    auser.save(function(err) {
      console.log('User saved successfully!');
    });

*/





var url = 'mongodb://localhost:27017/myproject';

var myapp = {
  openDb : function () {
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
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log('opened conection');
    });
    console.log('gooParseList');
		User.find({}, function(err, users) {
      if (err) throw err;
      console.log(users);
      // db.disconnect();
    });
	},
  gooAddItem : function (data, callback) {
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log('opened conection');
    });
		var auser = new User({
      name: 'Yourname 1',
      username: 'duongtang 1',
      password: 'tamtang 1' 
    });
    // call the custom method. this will just add -dude to his name
    // user will now be Chris-dude
  /*  auser.dudify(function(err, name) {
      if (err) throw err;
      console.log('Your new name is ' + name);
    });*/
    // call the built-in save method to save to the database
    auser.save(function(err) {
      //if (err) throw err;
      console.log('User saved successfully!');
      
    });
	},
  gooUpdateItem : function (data, callback) { 
    console.log('gooUpdateItem');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {});
    User.findOneAndUpdate({ username: 'duongtang' }, { username: 'duong tam tang' }, function(err, user) {
    if (err) throw err;
      console.log(user);
    });
  },
  gooDeleteItem : function (data, callback) { 
    console.log('gooDeleteItem');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {});
    User.remove({ username: 'duongtang 1' }, function(err, numberRow) {
      console.log('numberRow',numberRow)
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
module.exports = myapp;
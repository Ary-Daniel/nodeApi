//server.js

//BASE SETUP

// ==============================================================================================


// call the packages we need

var express=require('express'); //call express

var app=express();              // define our app using express

var bodyParser=require('body-parser'); 

// configure app to usse boyParser();
// this will let us get the data from a POST

var mongoose=require('mongoose');

var Bear=require('./nodeApi/models/bear');

mongoose.conect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

var port=process.env.PORT || 8080;  // set our port

// ROUTES FOR OUR API 

// ===============================================================================================

var router=express.Router();        // get an instance of the express Router

// test route to make sure everything is working (accesed at GET http:localhost:8080/api)

var callback=function(req,res){
 var msg={message:'welcome to your API'};
	res.json(msg);
}

router.get('/',callback)

// more routes

// on routes that end in /bears

router.route('/bears')

// create a bear (accesed at POST http://localhost:8080/api/bears)

.post(function(req,res){

	var bear= new Bear();     //create a new instance of the Bear

	bear.name=req.body.name; // set the bears name (comes from the request)

	// save the bear and check for errors

	bear.save(function(err){

		if (err)

			res.send(err);
		res.json({message: 'Bear has been created'});
	});

});

//REGISTER OUR ROUTES ---------------------------------------------------------------------------

// all of our routes will be prefixed with api

app.use('/api',router);

// START THE SERVER

// ==============================================================================================

app.listen(port);

console.log('initializing server on port'+ port);


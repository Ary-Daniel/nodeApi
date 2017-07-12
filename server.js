//server.js 


// llamar los paquetes

var express=require('express'); 

var app=express();              // definir la variable usando express (objeto con muchas funciones)

var bodyParser=require('body-parser'); // ? no entiendo aún la función del body-parser y su relación con un término denominado middleware (es la parte mas confusa)

// configuración para usar body parser
// se supone que esto permitirá obtener los datos desde un post

var mongoose=require('mongoose'); // ?

var Bear=require('./models/bear.js');

mongoose.connect('mongodb://localhost/test'); // se supone que esta parte conecta con la base de datos pero falla al conectarse
// revisé los detalles en stack overflow pero no entendí por qué razón se usa mongoose y la base de datos
//https://stackoverflow.com/questions/27011007/application-not-connecting-to-mongoose-database

app.use(bodyParser.urlencoded({extended:true})); // con la propiedad use nos permite utilizar body parser como middleware

app.use(bodyParser.json()); // ?

var port=process.env.PORT || 8080;  // establecer el puerto 

// routes para la API



var router=express.Router();        // se crea una instancia de express 

// ?

var loggin=function(req,res,next){

// esto ocurrirá con cada solicitud o rquest

console.log(" something it's happening");
next();

}

router.use(loggin); // 

// se supone que con este callback se aseguro de que la concección con el servidor local funciona adecuadamente ? (accede la petición GET http:localhost:8080/api)

var callback=function(req,res){
	var msg={message:'welcome to your API'};
	res.json(msg);
}

router.get('/',callback)

// otros routes

// * (entiendo que es similar el ejemplo de los cafés )

router.route('/bears')

// se crea el objeto (accede a la petición POST http://localhost:8080/api/bears)

.post(function(req,res){

	var bear= new Bear();     // se crea una nueva instancia del objeto 

	bear.name=req.body.name; // ?

	// se guarda la instancia 

	bear.save(function(err){

		if (err)

			res.send(err);

		res.status(201).json({message: 'Bear has been created'}); // aquí es donde se confirma que el POST funcíonó
	});

})

// se obtienen todos los objetos se accede a la petición GET ( http://localhost:8080/api/bears)

.get(function(req,res){

	Bear.find(function(err,bears){

		if(err)

			res.send(err);

		res.json(bears);


	});

})

.delete(function(req,res){
	Bear.remove(req.params,function(err,bears){

		if (err){
			res.send(err);
		}
		res.json({message: "bears has been removed"});

	})
});

// Route para poder obtener un recurso por su id

router.route('/bears/:bear_id')

.get(function(req,res){

	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

	console.log(checkForHexRegExp.test(req.params.bear_id));

	if(checkForHexRegExp.test(req.params.bear_id)){

		Bear.findById(req.params.bear_id, function(err,bear){

			if (err) {

				res.send(err);

			}

			else if (!bear){

				res.sendStatus(404);

			}

			else {

				res.json(bear);

			}

		}) }
		else{
			res.sendStatus(400);
		}

	})

.delete(function(req,res){

	Bear.remove({

		_id: req.params.bear_id
	}
	,function(err,bear){

		if(err)

			res.send(err);
		res.json({message: "bear has been deleted"});

	});
});

// ?

app.use('/api',router); // ?

// Se inicia el servidor



app.listen(port);

console.log('initializing server on port'+ port);


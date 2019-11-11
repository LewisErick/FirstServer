
let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let { StudentList } = require('./model');
const {DATABASE_URL, PORT} = require('./config');

let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

let students = [{
		name : "Mario",
		id : 52436
	},
	{
		name : "Maria",
		id : 83746	
	},
	{
		name : "Pedro",
		id : 12345	
	}
	];

app.get( "/api/students", ( req, res, next ) => {
	StudentList.get()
		.then( students => {
			return res.status( 200 ).json( students );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.post( "/api/students", jsonParser, ( req, res, next ) => {
	if (!req.body.firstName) {
		return res.status(401).json("Missing firstName parameter");
	}
	if (!req.body.firstName) {
		return res.status(401).json("Missing lastName parameter");
	}

	let firstName = req.body.firstName;
	let lastName = req.body.lastName;

	let newStudent = {
		firstName,
		lastName
	}

	StudentList.post(newStudent)
		.then( student => {
			return res.status( 201 ).json({
				message : "Student added to the list",
				status : 201,
				student : student
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later.",
				err: error
			})
		});

});

app.put( "/api/students/:id", jsonParser, ( req, res, next ) => {
	let id = req.params.id;

	if ( !id ){
		res.statusMessage = "Missing 'id' field in params!";
		return res.status( 406 ).json({
			message : "Missing 'id' field in params!",
			status : 406
		});
	}

	StudentList.put(id, req.body.newValue)
		.then( student => {
			return res.status( 201 ).json({
				message : "Student added to the list",
				status : 201,
				student : student
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later.",
				err: error
			})
		});
});

app.get( "/api/students/:id", ( req, res, next ) => {
	let id = req.params.id;

	if ( !id ){
		res.statusMessage = "Missing 'id' field in params!";
		return res.status( 406 ).json({
			message : "Missing 'id' field in params!",
			status : 406
		});
	}

	StudentList.get_by_id(id)
		.then( student => {
			return res.status( 200 ).json( student );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.delete( "/api/students/:id", ( req, res, next ) => {
	let id = req.params.id;

	if ( !id ){
		res.statusMessage = "Missing 'id' field in params!";
		return res.status( 406 ).json({
			message : "Missing 'id' field in params!",
			status : 406
		});
	}

	StudentList.delete(id)
		.then( student => {
			return res.status( 200 ).json( student );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( 8080, "mongodb://localhost/studentsDB" )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
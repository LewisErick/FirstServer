
let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let { StudentList } = require('./model');

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

app.post( "/api/postStudent", jsonParser, ( req, res, next ) => {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let id = req.body.id;

	let newStudent = {
		firstName,
		lastName,
		id
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
				message : "Something went wrong with the DB. Try again later."
			})
		});
	/*
	if ( ! name || ! id ){
		res.statusMessage = "Missing field in body!";
		return res.status( 406 ).json({
			message : "Missing field in body!",
			status : 406
		});
	}

	for( let i = 0; i < students.length; i ++ ){
		if ( id == students[i].id ){
			res.statusMessage = "Repeated identifier, cannot add to the list.";

			return res.status( 409 ).json({
				message : "Repeated identifier, cannot add to the list.",
				status : 409
			});
		}
	}

	let newStudent = {
		id : id,
		name : name
	};

	students.push( newStudent );

	return res.status( 201 ).json({
		message : "Student added to the list",
		status : 201,
		student : newStudent
	});
	*/

});

app.get( "/api/getStudentById", ( req, res, next ) =>{
	let id = req.query.id;

	if ( !id ){
		res.statusMessage = "Missing 'id' field in params!";
		return res.status( 406 ).json({
			message : "Missing 'id' field in params!",
			status : 406
		});
	}

	for( let i = 0; i < students.length; i ++ ){
		if ( id == students[i].id ){
			return res.status( 202 ).json({
				message : "Student found in the list",
				status : 202,
				student : students[i]
			});
		}
	}

	res.statusMessage = "Student not found in the list.";

	return res.status( 404 ).json({
		message : "Student not found in the list.",
		status : 404
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

runServer( 8181, "mongodb://localhost/studentsDB" )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };

















let express = require( "express" );
let morgan = require( "morgan" );
let bodyParser = require( "body-parser" );

let app = express();
let jsonParser = bodyParser.json();

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
	// res.statusMessage = "Something went wrong. Try again later."
	// return res.status(400).json({message : "Something went wrong. Try again later.",status : 400});
	return res.status( 200 ).json( students );
});

app.post( "/api/postStudent", jsonParser, ( req, res, next ) => {
	let name = req.body.name;
	let id = req.body.id;

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



app.listen( "8080", () => {
	console.log( "App is running on port 8080" );
});









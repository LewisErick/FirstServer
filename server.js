
let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static('public'));

app.use(morgan("dev"));

let students = [{
		name : "Mario",
		id : 52436
	},
	{
		name: "Maria",
		id : 83746	
	},
	{
		name: "Pedro",
		id : 12345	
	}
	];

app.get("/api/students", (req, res, next) => {
	// res.statusMessage = "Something went wrong. Try again later."
	// return res.status(400).json({message : "Something went wrong. Try again later.",status : 400});
	return res.status(200).json( students );
});

app.post( "/api/postStudent", jsonParser, (req, res) => {
	let name = req.body.name;
	let id = req.body.id;

	if ( ! name || ! id ){
		res.statusMessage = "Missing field in body!";
		return res.status(406).json({
			message : "Missing field in body!",
			status : 406
		});
	}



	return res.status(200).json({message : "success"});

});



app.listen("8080", () => {
	console.log("App is running on port 8080");
});









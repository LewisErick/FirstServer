
let express = require("express");
let morgan = require("morgan");
let app = express();

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
	return res.status(200).json(students);
});

app.listen("8080", () => {
	console.log("App is running on port 8080");
});
let mongoose = require('mongoose');
const uuid = require('uuidv4').default;

mongoose.Promise = global.Promise;

// Student SCHEMA and API definition.
let studentSchema = mongoose.Schema({
	firstName : { type : String },
	lastName : { type : String },
	id : { 
			type : String,
			required : true }
});

let Student = mongoose.model( 'Student', studentSchema );
let StudentList = {
	get : function(){
		return Student.find()
				.then( students => {
					return students;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	post : function( newStudent ){
		newStudent.id = uuid()
		return Student.create(newStudent)
				.then(student => {
					return student;
				})
				.catch( error => {
					console.log(newStudent, error);
					throw Error(error);
				});
	},
	get_by_id: function( id ) {
		return Student.findOne({id: id})
					.then(student=> {
						return student;
					})
					.catch( error => {
						throw Error(error);
					});
	},
	put: function( id, newValue ) {
		return Student.findOneAndUpdate({id: id}, {$set: newValue}, {new: true})
					.then(student=> {
						return student;
					})
					.catch( error => {
						throw Error(error);
					});
	},
	delete: function(id) {
		return Student.findOneAndRemove({id: id})
					.then(student => {
						return student;
					})
					.catch( error => {
						throw new Error(error);
					});
	}
}

// TodoSchema
let TodoSchema = mongoose.Schema({
	id: {
		type: String, required: true
	},
	description: {type: String},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Student'
	}
});

module.exports = { StudentList };
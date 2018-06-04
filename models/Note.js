var mongoose = require('mongoose');

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Using the schema constructor, create a new noteSchema object
var noteSchema = new Schema({ 
    _headLineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
},
    date: String,
    noteText: String
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;
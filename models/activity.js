var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Activity schema
var ActivitySchema = new Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    }
});

// return the model
module.exports = mongoose.model('Activity', ActivitySchema);
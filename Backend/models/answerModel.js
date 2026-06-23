const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({

    // ANSWER TEXT
    answer: {
        type : String,
        required : [true, 'Answer text is required'],
        trim : true,
        minLength: [10, 'Answer must be at least 10 characters long'],
        maxLength: [500, 'Answer cannot exceed 500 characters']
    },

    // RELATIONSHIP FIELD - USER WHO POSTED THE ANSWER
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },

    // RELATIONSHIP FIELD - QUESTION TO WHICH THIS ANSWER BELONGS
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'Question ID is required'],
        index : true
    },

    // VOTE COUNT FIELDS
    up_votes: {
        type: Number,
        default: 0,
        min : 0 
    },

    down_votes: {
        type: Number,
        default: 0,
        min : 0
    },

    // ARRAY OF USER IDS WHO UPVOTED OR DOWNVOTED THIS ANSWER - TO PREVENT MULTIPLE VOTES FROM SAME USER
    upvoted_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    downvoted_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // TIME STAMPS
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true
    },

    updated_at: {
        type: Date,
        default: Date.now
    }

});

// PRE-SAVE HOOK TO UPDATE TIMESTAMP - UPDATED_AT GETS UPDATED WHEN save() USED IN CONTROLLER
answerSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

answerSchema.index({ question_id: 1, up_votes: -1 });
answerSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Answer', answerSchema);
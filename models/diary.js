const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    addTitle:{
        type:String,
        required:true
    },
    addContent:{
        type:String,
        required:true
    },
    addDate:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('Diary',diarySchema);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/football-legends');

const level = Number(process.argv[2]);

let EventSchema = new mongoose.Schema({
    _id: Number,
    level: Number,
	image: String,
	variants: [String],
    question: String, 
	answer: String,
}, { _id: false, versionKey: false})
let Event = mongoose.model('Event', EventSchema);
const fs = require('fs');

let answers = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/events/answers${level}.txt`, {
    encoding: 'utf-8'
});

answers = answers.split("\n");
answers.pop();
let events = [];
let answer = "";
let question = "";
let splited = [];
let variants = [];
answers.map((answer, index) => {
    splited[index] = answer.split("*");
    question = splited[index][1];
    answer = splited[index][2];
	variants = splited[index][3].split("|");
    events.push({
		question,
		answer,
		variants
	});
});


let images = [];
for(let i = 0; i<10; i++) {
    let bitmap = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/events/level_${level}_resized/${i+1}.jpg`);
    images.push(new Buffer(bitmap).toString('base64'));
}
let tasks = [];

for(let i = 0; i<10; i++) {
    tasks[i] = {
        question: events[i].question,
        answer: events[i].answer,
        variants: events[i].variants,
        _id: i+1,
        level,
        image: 'data:image/jpeg;base64,'+images[i]
    };
}

Event.insertMany(tasks, (err, tasks) => {
    if(err) console.log(err);
    else {
        console.log(JSON.stringify(tasks[5]));
        mongoose.disconnect();
    }
});


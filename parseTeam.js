const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/football-legends');

const level = Number(process.argv[2]);

let TeamSchema = new mongoose.Schema({
    _id: Number,
    level: Number,
	image: String,
	answer: String,
}, { _id: false, versionKey: false})
let Team = mongoose.model('Team', TeamSchema);
const fs = require('fs');

let answers = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/teams/answers${level}.txt`, {
    encoding: 'utf-8'
});

answers = answers.split("\n");
answers.pop();
let teams = [];
let team = "";
let splited = [];
answers.map((answer, index) => {
    splited[index] = answer.split("*");
    team = splited[index][1];
    team = team.replace("\r", '');
    teams.push(team);
});


let images = [];
for(let i = 0; i<40; i++) {
    let bitmap = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/teams/level_${level}_resized/${i+1}.png`);
    images.push(new Buffer(bitmap).toString('base64'));
}

let tasks = [];

for(let i = 0; i<40; i++) {
    tasks[i] = {
        answer: teams[i],
        _id: i+1,
        level,
        image: 'data:image/png;base64,'+images[i]
    };
}

Team.insertMany(tasks, (err, tasks) => {
    if(err) console.log(err);
    else {
        console.log(tasks[5]);
        mongoose.disconnect();
    }
});


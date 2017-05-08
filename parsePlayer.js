const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/football-legends');

const level = Number(process.argv[2]);

let PlayerSchema = new mongoose.Schema({
    _id: Number,
    level: Number,
	image: String,
	answer: String,
}, { _id: false, versionKey: false})
let Player = mongoose.model('Player', PlayerSchema);
const fs = require('fs');

let answers = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/players/answers${level}.txt`, {
    encoding: 'utf-8'
});

answers = answers.split("\n");
answers.pop();
let players = [];
let player = "";
let splited = [];
answers.map((answer, index) => {
    splited[index] = answer.split(" ");
    player = splited[index][1];
    if (splited[index].length > 2)
        player += (" " + splited[index][2]);
    player = player.replace("\r", '');
    players.push(player);
});


let images = [];
for(let i = 0; i<50; i++) {
    let bitmap = fs.readFileSync(`/home/vasyl/Desktop/Projects/DB/players/level_${level}_resized/${i+1}.jpg`);
    images.push(new Buffer(bitmap).toString('base64'));
}

let tasks = [];

for(let i = 0; i<50; i++) {
    tasks[i] = {
        answer: players[i],
        level,
        _id: i+1,
        image: 'data:image/jpeg;base64,'+images[i]
    };
}

Player.insertMany(tasks, (err, tasks) => {
    if(err) console.log(err);
    else {
        console.log(tasks[5]);
        mongoose.disconnect();
    }
});


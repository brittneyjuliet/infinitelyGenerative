const SAMPLE_LIBRARY = {
	'piano': [
		{note: 'C#', octave: 2, file: 'data/Player_dyn3_rr1_008.wav'},
		{note: 'C#', octave: 3, file: 'data/Player_dyn3_rr1_014.wav'},
		{note: 'C#', octave: 4, file: 'data/Player_dyn3_rr1_020.wav'},
		{note: 'C#', octave: 5, file: 'data/Player_dyn3_rr1_026.wav'},
		{note: 'F', octave: 2, file: 'data/Player_dyn3_rr1_010.wav'},
		{note: 'F', octave: 3, file: 'data/Player_dyn3_rr1_016.wav'},
		{note: 'F', octave: 4, file: 'data/Player_dyn3_rr1_022.wav'},
		{note: 'F', octave: 5, file: 'data/Player_dyn3_rr1_028.wav'},
		{note: 'A', octave: 2, file: 'data/Player_dyn3_rr1_012.wav'},
		{note: 'A', octave: 3, file: 'data/Player_dyn3_rr1_018.wav'},
		{note: 'A', octave: 4, file: 'data/Player_dyn3_rr1_024.wav'},
		{note: 'A', octave: 5, file: 'data/Player_dyn3_rr1_030.wav'}
	]
};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

var sounds = [];
let button;
let unLocked = true;
let amplitude;

function preload(){
	for (let i = 0; i < SAMPLE_LIBRARY['piano'].length; i++){
		sounds.push(loadSound(SAMPLE_LIBRARY['piano'][i].file));
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	// put setup code here

	// for (var i = 0; i < sounds.length; i++){
	// 	sounds[i].playMode('restart');
	// }

	amplitude = new p5.Amplitude();

	button = createButton('play');
	button.mousePressed(begin);
	button.center();
}

function flatToSharp(note) {
	switch (note) {
	  case 'Bb': return 'A#';
	  case 'Db': return 'C#';
	  case 'Eb': return 'D#';
	  case 'Gb': return 'F#';
	  case 'Ab': return 'G#';
	  default:   return note;
	}
  }

// separates note and octave information into independent strings
function getSample(instrument, noteAndOctave){
	let [, requestedNote, requestedOctave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
  	requestedOctave = parseInt(requestedOctave, 10);
	requestedNote = flatToSharp(requestedNote);

	let sampleBank = SAMPLE_LIBRARY[instrument];
	let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
	let distance = 
		getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
	// return fetchSample(sample.file).then(audioBuffer => ({
	// 	audioBuffer: audioBuffer,
	// 	distance: distance
	// 	}));
	//return [distance, sample.file];
	return {
		'distance': distance,
		'file': sample.file
	};
}

// returns unique integer identifier for each pitch

function noteValue(note, octave){
	//console.log(OCTAVE.indexOf(note));
	return octave * 12 + OCTAVE.indexOf(note);
}

// returns distance between two notes
function getNoteDistance(note1, octave1, note2, octave2){
	return noteValue(note1, octave1) - noteValue(note2, octave2);
}

// returns nearest sample to requested pitch
function getNearestSample(sampleBank, note, octave){
	let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
		let distanceToA =
			Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
		let distanceToB =
			Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
		return distanceToA - distanceToB;
	});
	//console.log(sortedBank[0]);
	return sortedBank[0];
}

function playSample(instrument, note, delaySeconds){
	// getSample(instrument, note).then(({distance}) => {
	// 	let playbackRate = Math.pow(2, distance / 12);
	// 	sample.file.play(0, playbackRate);
	// });
	getSample(instrument, note);
		let sampleInfo = getSample(instrument, note);
		let playbackRate = Math.pow(2, sampleInfo.distance / 12);
		let index = SAMPLE_LIBRARY['piano'].map(e => e.file).indexOf(sampleInfo.file);
		sounds[index].play(delaySeconds, playbackRate);
		//console.log(sounds[index].isPlaying());
}

// Temporary test code
function startLoop(instrument, note, loopLengthSeconds, delaySeconds){
	// setTimeout(() => playSample('piano', 'F4'),  1000);
	// setTimeout(() => playSample('piano', 'Ab4'), 2000);
	// setTimeout(() => playSample('piano', 'C5'),  3000);
	// setTimeout(() => playSample('piano', 'Db5'), 4000);
	// setTimeout(() => playSample('piano', 'Eb5'), 5000);
	// setTimeout(() => playSample('piano', 'F5'),  6000);
	// setTimeout(() => playSample('piano', 'Ab5'), 7000);
	playSample(instrument, note, delaySeconds);
	setInterval(() => playSample(instrument, note, delaySeconds), loopLengthSeconds * 1000);	
}

function begin(){
	startLoop('piano', 'F4', random(20, 25), random(1, 4));
	startLoop('piano', 'Ab4', random(15, 20), random(8, 10));
	startLoop('piano', 'C5', random(22, 30), random(3, 6));
	startLoop('piano', 'Db5', random(17, 22), random(8, 16));
	startLoop('piano', 'Eb5', random(12, 15), random(8, 10));
	startLoop('piano', 'F5', random(17, 24), random(8, 12));
	startLoop('piano', 'Ab5', random(5, 7), random(2, 4));
}

function draw() {
	// put drawing code here

	let level = amplitude.getLevel();
	let size = map(level, 0, 1, 0, height);

	//ellipse(width/2, height/2, size, size);

	fill(random(255), random(255), random(255), random(127));
	noStroke();
	ellipse(random(width), random(height), size, size);

	//console.log(level);

}

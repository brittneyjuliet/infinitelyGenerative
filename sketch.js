let theShader;

const SAMPLE_LIBRARY = {
	'marimba': [
		{note: 'F', octave: 2, file: 'data/Marimba_hit_Outrigger_F1_loud_01.wav'},
		{note: 'C', octave: 2, file: 'data/Marimba_hit_Outrigger_C2_loud_01.wav'},
		{note: 'G', octave: 2, file: 'data/Marimba_hit_Outrigger_G2_loud_01.wav'},
		{note: 'B', octave: 2, file: 'data/Marimba_hit_Outrigger_B2_loud_01.wav'},
		{note: 'F', octave: 3, file: 'data/Marimba_hit_Outrigger_F3_loud_01.wav'},
		{note: 'C', octave: 4, file: 'data/Marimba_hit_Outrigger_C4_loud_01.wav'},
		{note: 'G', octave: 4, file: 'data/Marimba_hit_Outrigger_G4_loud_01.wav'},
		{note: 'B', octave: 4, file: 'data/Marimba_hit_Outrigger_B4_loud_01.wav'},
		{note: 'F', octave: 5, file: 'data/Marimba_hit_Outrigger_F5_loud_01.wav'},
		{note: 'C', octave: 6, file: 'data/Marimba_hit_Outrigger_C6_loud_01.wav'},
	],
	'synth': [
		// {note: 'G', octave: 3, file: 'data/01_LF2_Texture_122_Cm7.wav'},
		{note: 'A', octave: 3, file: 'data/LANDR_LS_Synth_Arp_Mood_keyAmin_100bpm.wav'},
		{note: 'C', octave: 5, file: 'data/Erang - Dungeon Synth Free Samples Pack - 50 Pad_06_C.wav'}
		
	]
};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

var sounds = [];
let blobs = [];
let button;
let unLocked = true;
let amplitude;
let cVerb;

function preload(){

	theShader = loadShader('shader.vert', 'shader.frag');
	cVerb = createConvolver('data/AirportTerminal.wav');

	for (let i = 0; i < SAMPLE_LIBRARY['marimba'].length; i++){
		sounds.push(loadSound(SAMPLE_LIBRARY['marimba'][i].file));
		
	}
	for (let i = 0; i < SAMPLE_LIBRARY['synth'].length; i++){
		sounds.push(loadSound(SAMPLE_LIBRARY['synth'][i].file));
	}
}

function setup() {
	// put setup code here
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight, WEBGL);
	noStroke();
	
	for (let i = 0; i < 9; i++){
		blobs.push(new Blobby(random(width), random(height)));
	}

	amplitude = new p5.Amplitude();

	button = createButton('play');
	button.mousePressed(begin);
	button.center();

	for (var i = 0; i < sounds.length; i++){
		sounds[i].disconnect;
		cVerb.process(sounds[i]);
	}
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

function playSample(instrument, note, delaySeconds, amplitude){
	getSample(instrument, note);
		let sampleInfo = getSample(instrument, note);
		let playbackRate = Math.pow(2, sampleInfo.distance / 12);
		let index = sounds.map(e => e.file).indexOf(sampleInfo.file);
		sounds[index].play(delaySeconds, playbackRate, amplitude);
}

function startLoop(instrument, note, loopLengthSeconds, delaySeconds, amplitude){
	// setTimeout(() => playSample('marimba', 'F4'),  1000);
	// setTimeout(() => playSample('marimba', 'Ab4'), 2000);
	// setTimeout(() => playSample('marimba', 'C5'),  3000);
	// setTimeout(() => playSample('marimba', 'Db5'), 4000);
	// setTimeout(() => playSample('marimba', 'Eb5'), 5000);
	// setTimeout(() => playSample('marimba', 'F5'),  6000);
	// setTimeout(() => playSample('marimba', 'Ab5'), 7000);
	playSample(instrument, note, delaySeconds, amplitude);
	setInterval(() => playSample(instrument, note, delaySeconds, amplitude), loopLengthSeconds * 1000);	
}

function begin(){

	startLoop('marimba', 'A2', random(20, 22), 13.9, 1);
	startLoop('marimba', 'A4', 17.3, random(3, 6), 1);
	startLoop('marimba', 'B4', random(20, 25), 3.2, 1);
	startLoop('marimba', 'D5', 14.3, 12.6), 1;
	startLoop('marimba', 'E5', random(18, 20), random(12, 15), 1);
	startLoop('marimba', 'G5', random(12, 15), random(22, 23), 1);
	startLoop('synth', 'G3', random(13, 15), 0.0, .3);
}

function draw() {
	// put drawing code here
	background(247);

	let level = amplitude.getLevel();
	let size = map(level, 0, 1, .01, .07);

	// send resolution of sketch into shader
	theShader.setUniform("u_resolution", [width, height]);

	// we divide millis by 1000 to convert it to seconds
	theShader.setUniform("u_time", millis() / 1000.0); 

	// peak vol test
	theShader.setUniform("u_size", size);

	// bring on the blobs!!!
	theShader.setUniform("u_blob0", [blobs[0].x, blobs[0].y]);
	theShader.setUniform("u_blob1", [blobs[1].x, blobs[1].y]);
	theShader.setUniform("u_blob2", [blobs[2].x, blobs[2].y]);
	theShader.setUniform("u_blob3", [blobs[3].x, blobs[3].y]);
	theShader.setUniform("u_blob4", [blobs[4].x, blobs[4].y]);
	theShader.setUniform("u_blob5", [blobs[5].x, blobs[5].y]);
	theShader.setUniform("u_blob6", [blobs[6].x, blobs[6].y]);
	theShader.setUniform("u_blob7", [blobs[7].x, blobs[7].y]);

	// shader() sets the active shader with our shader
	shader(theShader);
	rect(0, 0, width, height);

	for (let i = 0; i < blobs.length; i++){
		blobs[i].update();
	}
}




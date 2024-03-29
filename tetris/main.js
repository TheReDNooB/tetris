const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);

/*primera funcion*/

function arenasweep(){

	let rowcount = 1;
	outer: for( let y = arena.length - 1; y > 0; --y){
		for(let x = 0; x < arena[y].length; ++x){
			if(arena[y][x] === 0){
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;

		player.score += rowcount *10;
		rowcount *= 2;
	}

}

/*segunda funcion*/

function collide(arena, player){

	const m = player.matrix;
	const o = player.pos;

	for(let y = 0; y < m.length; ++y){
		for(let x = 0; x < m[y].length; ++x){
			if(m[y][x] !== 0 && (arena[y +o.y] && arena [y +o.y][x + o.x]) !== 0){
			return true;
		}
		}
	}

	return false;
}

/*tercera funcion*/

function creatematrix(w, h){

	const matrix = [];
	while(h--){
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

/*cuarta funcion*/
function createpiece(type){

	if(type === "I"){
		return[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		];
	}else if(type === "L"){
		return[
			[0, 2, 0],
			[0, 2, 0],
			[0, 0, 2],
		];
	}else if(type === "J"){
		return[
			[0, 3, 0],
			[0, 3, 0],
			[3, 0, 0],
		];
	}else if(type === "O"){
		return[
			[4, 4],
			[4, 4],

		];
	}else if(type === "Z"){
		return[
			[5, 5, 0],
			[0, 5, 5],
			[0, 0, 0],
		];
	}else if(type === "S"){
		return[
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		];
	}else if(type === "T"){
		return[
			[0, 7, 0],
			[7, 7, 7],
			[0, 0, 0],
		];
	}

}

/*quinta funcion*/

function drawmatrix(matrix, offset) {
	
	matrix.forEach((row, y) => {
		row.forEach((value, x) =>{
			if(value !== 0){
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});

}

/*sexta funcion*/
function draw() {
	
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawmatrix(arena, {x: 0, y: 0});
	drawmatrix(player.matrix, player.pos);

}

/*septima funcion*/
function merge(arena, player) {
	
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				arena[y +player.pos.y][x +player.pos.x] = value;
			}
		});
	});

}

/*octava funcion*/
function rotate(matrix, dir) {
	
	for(let y = 0; y < matrix.length; ++y){
		for(let x = 0; x < y; ++x){
			[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
		}
	}
	if(dir > 0){
		matrix.forEach((row) => row.reverse());
	}else{
		matrix.reverse();
	}
}

/*novena funcion*/
function playerdrop() {
	
	player.pos.y++;
	if(collide(arena, player)){
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenasweep();
		updatescore();
	}
	dropcounter = 0;

}

/*decima funcion*/
function playermove(offset) {
	
	player.pos.x += offset;
	if(collide(arena, player)){
		player.pos.x -= offset;
	}

}

/*onceava funcion*/
function playerReset() {
	
	const pieces = "TJLOSZI";
	player.matrix = createpiece(pieces[(pieces.length * Math.random()) | 0]);
	player.pos.y = 0;
	player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
	if(collide(arena, player)){
		arena.forEach((row) => row.fill(0));
		player.score = 0;
		updatescore();
	}

}

/*doceava funcion*/
function playerrotate(dir) {
	
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while(collide(arena, player)){
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1: -1));
		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}

}

/*variables*/
let dropcounter = 0;
let dropinterval = 1000;
let lastime = 0;

/*treceava funcion*/
function update(time = 0) {
	
	const deltatime = time -lastime;
	dropcounter += deltatime;
	if (dropcounter > dropinterval) {
		playerdrop();
	}
	lastime = time;
	draw();
	requestAnimationFrame(update);
}

/*catorceava funcion*/
function updatescore() {
	
	document.getElementById("score").innerText = "Score : " + player.score;

}

document.addEventListener("keydown", (event) => {

	if(event.keyCode === 37){
		playermove(-1);
	}else if(event.keyCode === 39){
		playermove(1);
	}else if(event.keyCode === 40){
		playerdrop();
	}else if(event.keyCode === 81){
		playerrotate(-1);
	}else if(event.keyCode === 87){
		playerrotate(1);
	}

});

const colors = [

	null,
	"#ff0d72",
	"#0dc2ff",
	"#0dff72",
	"#f539ff",
	"#ff9e0d",
	"#ffe138",
	"#3877ff",

];

const arena = creatematrix(12, 20);
const player = {
	pos: {x:0, y: 0},
	matrix: null,
	score: 0,
};

playerReset();
updatescore();
update();
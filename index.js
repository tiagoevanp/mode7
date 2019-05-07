import evanbrosce from './node_modules/evanbrosce/EvanBrosCE.js';

const canvas1 = evanbrosce.init('canvas1', 250, 250);
const canvas2 = evanbrosce.init('canvas2', 250, 250);

//////////////
// CANVAS 1 //
//////////////
let geometric = {};
const load1 = () => {
	canvas1.loadImage('img', './img.png');
	geometric.p1 = [10, 30];
	geometric.p2 = [240, 30];
	geometric.p3 = [50, 220];
	geometric.p4 = [200, 220];
}

const update1 = () => {
}

const render1 = () => {
	canvas1.draw.image(canvas1.assets['img'], {x:50, y:50, width: 150, height:150});
	canvas1.draw.setColor('red');
	canvas1.draw.path(
		{
			x: [
				geometric.p1[0],
				geometric.p2[0],
				geometric.p4[0],
				geometric.p3[0],
				geometric.p1[0]
			], 
			y: [
				geometric.p1[1], 
				geometric.p2[1], 
				geometric.p4[1], 
				geometric.p3[1], 
				geometric.p1[1]
			]
		}, 
		1, 
		'stroke'
	)
}

//////////////
// CANVAS 2 //
//////////////
const load2 = () => {
}

const update2 = () => {
}

const render2 = () => {
}

canvas1.run(load1, update1, render1);
canvas2.run(load2, update2, render2);
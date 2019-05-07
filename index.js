import evanbrosce from './node_modules/evanbrosce/EvanBrosCE.js';

const canvas1 = evanbrosce.init('canvas1', 250, 250);
const canvas2 = evanbrosce.init('canvas2', 250, 250);

let geometric = {};
geometric.p1 = [10, 30];
geometric.p2 = [240, 30];
geometric.p3 = [50, 220];
geometric.p4 = [200, 220];

const load1 = () => {
	canvas1.loadImage('img', './img.png');
}

const update1 = () => {
}
const load2 = () => {
}

const update2 = () => {
}

//////////////
// CANVAS 1 //
//////////////

let test = true;
let pixelsData;

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
		if(test) {
			pixelsData = getPixels(geometric);
			console.log(pixelsData);
			test = false;
		}
	}
	
	//////////////
	// CANVAS 2 //
	//////////////

let draw = {};
draw.p1 = [50	, 70];
draw.p2 = [200, 70];
draw.p3 = [50, 180];
draw.p4 = [200, 180];


const render2 = () => {
	canvas2.draw.setColor('red');
	canvas2.draw.path(
		{
			x: [
				draw.p1[0],
				draw.p2[0],
				draw.p4[0],
				draw.p3[0],
				draw.p1[0]
			], 
			y: [
				draw.p1[1], 
				draw.p2[1], 
				draw.p4[1], 
				draw.p3[1], 
				draw.p1[1]
			]
		}, 
		1, 
		'stroke'
	)
}

const getPixels = (g) => {
	let pixels = {};
	let pathX_1_3 = g.p3[0] - g.p1[0];
	let pathY_1_3 = g.p3[1] - g.p1[1];
	let pathX_2_4 = g.p4[0] - g.p2[0];
	let pathY_2_4 = g.p4[1] - g.p2[1];

	let hipotenusa_1_3 = Math.sqrt(Math.pow(pathX_1_3,2)+Math.pow(pathY_1_3,2));
	let hipotenusa_2_4 = Math.sqrt(Math.pow(pathX_2_4,2)+Math.pow(pathY_2_4,2));

	let sin_1_3 = pathX_1_3/hipotenusa_1_3;
	let sin_2_4 = pathX_2_4/hipotenusa_2_4;
	let cos_1_3 = pathY_1_3/hipotenusa_1_3;
	let cos_2_4 = pathY_2_4/hipotenusa_2_4;
	for(let i = 0; i < 100; i++) {
		let hip_1_3 = i*hipotenusa_1_3/100
		let hip_2_4 = i*hipotenusa_2_4/100

		let x_1_3 = sin_1_3*hip_1_3+g.p1[0];
		let y_1_3 = cos_1_3*hip_1_3+g.p1[1];
		
		let x_2_4 = sin_2_4*hip_2_4+g.p2[0];
		let y_2_4 = cos_2_4*hip_2_4+g.p2[1];
		let lPix = [];
		for(let j = x_1_3; j < x_2_4; j++) {	
			let pixel = canvas1.ctx.getImageData(j,y_1_3,1,1);
			lPix.push(pixel);
		}
		pixels[i] = lPix;
	}
	return pixels;
}

canvas1.run(load1, update1, render1);
canvas2.run(load2, update2, render2);
import evanbrosce from './node_modules/evanbrosce/EvanBrosCE.js';

const canvas1 = evanbrosce.init('canvas1', 250, 250);
const canvas2 = evanbrosce.init('canvas2', 250, 250);

//////////////
// CANVAS 1 //
//////////////
const load1 = () => {
	canvas1.loadImage('img', './img.png');
}

const update1 = () => {
}

const render1 = () => {
	canvas1.draw.image(canvas1.assets['img'], {x:0, y:0});
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
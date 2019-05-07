# EvanBrosCE
A Javascript 2D canvas engine based in HTML Canvas

# Documentation
## Installation
Install the package from **["npm"](https://www.npmjs.com/package/evanbrosce)**.

The command to install with "npm" package manager is:
```console
npm i evanbrosce

```

Now you can follow the instructions bellow in basic set to create your first application with EvanBrosCE.
## Basic Set
In your JS file write something like this:
```javascript
import EvanBrosCE from './node_modules/evanbrosce/EvanBrosCE.js';

const ce = EvanBrosCE.init();

const load = () => {
}

const update = () => {
}

const render = () => {
}

ce.run(load, update, render);
```

The **load** function should receive all the information that will be preloaded, simple data, objects, arrays, images or anything else that you want to use later.

The **update** function will be used to perform the update layer of the data that will be used on the canvas.

Finally you can use the function **render** to draw on the canvas.

## EvanBrosCE Properties
### startDate
The propertie show the Date that the EvanBrosCE application was initiated.

### fpsLimit
The FPS control of the application. You can use this for a slow motion in the update/render time.

## EvanBrosCE Main Methods
### init (component, [width], [height], [scale], [smooth], [style])
#### Parameters:
- component (string)
  - The HTML elemnt that will append the canvas element.
- width (number):
  - HTML width for the canvas element.
  - Default value: 400
- height (number):
  - HTML height for the canvas element.
  - Default value: 400
- scale (array):
  -array [number, number]
  -Array with two numbers that corresponds to the scale of canvas render;
- smooth (bool):
  - The pixels of scaled images are smoothed if true value.
  - Default value: false
- style (string):
  - HTML style for the canvas element.
  - Default value: "background: black"
#### Example:
```javascript
  const ce = EvanBrosCE.init(800, 500, true, "border: black solid 4px; background: white");
```

### run (load, update, render)
#### Parameters:
- load (function)
- update (function)
- render (function)
#### Example:
```javascript
  ce.run(myLoadFunction, myUpdateFunction, myRenderFunction);
```

### calculateFPS ()
#### Parameters:
- Void
#### Example:
```javascript
  const fps = ce.calculateFPS();
```

## EvanBrosCE Load And Create Methods
### loadImage (name, source)
#### Parameters:
- name (string):
	- The name that will be used to associate the image loaded.
- source (string):
	- The source of image file.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadImage("image1", "imgs/image1.png");
}
```

### loadSound (name, source)
#### Parameters:
- name (string):
	- The name that will be used to associate the sound loaded.
- source (string):
	- The source of sound file.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadSound("image1", "sounds/sound1.mp3");
}
```

### createTilemap (name, size, tiles, [margin])
#### Parameters:
- name (string):
	- The name that will be used to associate the tilemap grid created.
- size (object):
  - object { width (number), height (number) }
	- The size in pixels of tiles.
- tiles (object):
  - object { rows (number), columns (number) }
  - Quantity of rows and columns of the tilemap grid.
- margin:
  - If the tilemap has margin set the number in pixels.
  - Default value: 0
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadImage('tilemap', 'tilemap.jpg')
  ce.createTilemap(
    'tilemapGrid', 
    {width: 32, height: 32}, 
    {rows: 4, columns: 8}
  );
}
```

## EvanBrosCE Draw Methods
### draw.path (coordinates, thickness, type)
#### Parameters:
- coordinates (object):
	- object { x (array of numbers) , y (array of numbers) }
- thickness (number):
	- The thickness size of the path.
- type (string):
	- Accept one of this two values: "fill" or "stroke".
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.path(
    {x: [10, 20, 30, 40, 90], y: [40, 20, 100, 30, 50]},
    10,
    "stroke"
  );
}
```

### draw.curve (coordinates, radius, type)
#### Parameters:
- coordinates (object):
	- object { x (array of **three** numbers) , y (array of **three** numbers) }
- radius (number):
	- The radius size of circle created by this three points.
- type (string):
	- Accept one of this two values: "fill" or "stroke".
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.curve(
    {x: [100, 150, 150], y: [20, 20, 70]},
    50,
    "stroke"
  );
}
```

### draw.rectangle (coordinates, type)
#### Parameters:
- coordinates (object):
	- object { x (number) , y (number), width (number), height (number) }
- type (string):
	- Accept one of this two values: "fill", "stroke" or \*"clear".
	- \*The "clear" type will create a rectangle to erase the area.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.rectangle(
    {x: 10, y: 10, width: 100, height: 200},
    "fill"
  );
}
```

### draw.arc (coordinates, radius, type, [angles], [anticlockwise])
#### Parameters:
- coordinates (object):
	- object { x (number) , y (number) }
- radius (number):
	- The radius size of arc created.
- type (string):
	- Accept one of this two values: "fill" or "stroke"
- angles (object):
  - object {init (number), end (number)}
  - Default values: {init: 0, end: 360}
- anticlockwise (bool):
	- Default value: false

#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.arc(
    {x: 150, y: 200},
    100,
    "stroke"
  );
}
```

### draw.text (text, coordinates, type, style)
#### Parameters:
- text (string):
  - Text that will be draw.
- coordinates (object):
	- object { x (number) , y (number) }
- type (string):
	- Accept one of this two values: "fill" or "stroke".
- style (string):
  - One string with number in pixels and the font-family of the text.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.text(
    "Example of text...",
    {x: 120, y: 120},
    "fill",
    "16px Times New Roman"
  );
}
```

### draw.image (image, coordinates, [alpha])
#### Parameters:
- image (assets):
  - EvanBrosCE.assets['LOADED_IMAGE_NAME']
- coordinates (object):
	- object { x (number) , y (number), [width] (number), [height] (number), [mirror] (bool), [angle] (number) }
- alpha (number)
  - Default value: 1
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadImage("image1", "imgs/image1.png");
}

const render = () => {
  ce.draw.image(
    ce.assets['image1'],
    {x: 50, y: 50, angle: -20, mirror: true}
  );
}
```

### draw.tilemap (image, tilemap, matrix, coordinates, tileSize, [alpha])
#### Parameters:
- image (assets):
  - EvanBrosCE.assets['LOADED_IMAGE_NAME']
- tilemap (assets):
  - EvanBrosCE.assets['CREATED_TILEMAP']
- matrix
  - A two-dimensional array with the key number of tilemap.
- coordinates (object):
	- object { x (number) , y (number) }
- tileSize (object):
  - object { width (number) , height (number) }
  - The size of tile that will be render.
- alpha (number)
  - Default value: 1
#### Example:
```javascript
const ce = EvanBrosCE.init();

let matrix;

const load = () => {
  ce.loadImage("tilemap", "imgs/tilemap.png");
  matrix = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0]
  ]
}

const render = () => {
  game.draw.tilemap(
    game.assets['tiles'], 
    game.assets['tilemap'],
    matrix, 
    {x: 50, y: 50}, 
    {width: 32, height: 32}
  );
}
```

### draw.sprite (image, coordinates, sprite, frameLimit, timeToNextFrame, [alpha])
#### Parameters:
- image (assets):
  - EvanBrosCE.assets['LOADED_SPRITE_NAME']
- coordinates (object):
	- object { x (number) , y (number), [width] (number), [height] (number), [mirror] (bool), [angle] (number) }
- sprite (object)
  - object { x (number), y (number), width (number), height (number) }
  - The position and size in sprite sheet of the sprites.
  - The width and height must respect the original pixels size of the image.
- frameLimit (number)
	- Number of frames on sprite sheet.
- timeToNextFrame (number)
  - Time in seconds to change the frames on sprite sheet.
- alpha (number)
  - Default value: 1
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadImage("sprite1", "imgs/sprite1.png");
}

const render = () => {
  ce.draw.sprite(
    ce.assets['sprite1'],
    {x: 10, y: 10},
    {x: 0, y: 0, width: 60, height: 60},
    4,
    0.5
  );
}
```

### draw.pattern (image, coordinates, patternSize, repetition, [alpha])
#### Parameters:
- image (assets):
  - EvanBrosCE.assets['LOADED_SPRITE_NAME']
- coordinates (object):
	- object { x (number) , y (number), width (number), weight (number) }
  - Coordinates of the area that will receive the pattern.
- patternSize (object)
  - object { width (number), height (number) }
  - Size of pattern inside of area.
- repetition (string)
	- Accept one of this four values: "repeat", "no-repeat", "repeat-x" or "repeat-y".
- alpha (number)
  - Default value: 1
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadImage("pattern1", "imgs/pattern1.png");
}

const render = () => {
  ce.draw.pattern(
    ce.assets["pattern1"],
    {x: 100, y: 40, width: 400, height: 400},
    {width: 50, height: 50},
    "repeat"
  );
}
```

### draw.transform (a, b, c, d, e, f, fn)
#### Parameters:
- a (number) : Horizontal scaling
- b (number) : Horizontal skewing	
- c (number) : Vertical skewing
- d (number) : Vertical scaling
- e (number) : Horizontal translate
- f (number) : Vertical translate
- fn (function)
  - The function that will be executed when the transformation will be applied
#### Example:
```javascript
const ce = EvanBrosCE.init();

render() {
  ce.draw.transform(
    1, 0.5, -0.5, 1, 10, 10,
    () => {
      ce.draw.rectangle(
        {x:0, y:0, width:100, height:100},
        "fill"
      )
    }	
  );
}
```

## EvanBrosCE Draw Methods (Setters)
### draw.setColor (color)
#### Parameters:
- color (string)
  - Hexadecimal numbers or web colors.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.setColor('blue');

  ce.draw.rectangle(
    {x:100, y:50, width: 50, height: 50},
    "stroke"
  );
  
  ce.draw.setColor('#ff0000');

  ce.draw.rectangle(
    {x:200, y:100, width: 50, height: 50},
    "fill"
  );
}
```

### draw.setLinearGradient (coordinates, colors)
#### Parameters:
- coordinates (object)
  - object { x (number) , y (number), x2 (number), y2 (number) }
- colors (object)
  - object { \*color (number) }
  - Percentual number of the color in gradient.
  - \*Use hexadecimal numbers or web colors.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.setLinearGradient(
    {x: 400, y: 0, x2: 600, y2: 0}, 
    {"red": 0, "green": 20, "white": 40, "blue": 60, "#cc00dd": 80, "yellow": 100}
  );
  
  ce.draw.rectangle({x: 400, y: 150, width: 200, height: 200}, "fill");  
}
```

### draw.setRadialGradient (coordinates, colors)
#### Parameters:
- coordinates (object)
  - object { x (number) , y (number), x2 (number), y2 (number) }
- colors (object)
  - object { \*color (number) }
  - Percentual number of the color in gradient.
  - \*Use hexadecimal numbers or web colors.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  ce.draw.setRadialGradient(
    {x: 250, y: 250, initR: 25	, endR: 100}, 
    {'red': 0, 'green': 33, 'white': 66, 'blue': 100}
  );
  
  ce.draw.arc({x: 250, y: 250}, 100, 'fill');
}
```

### draw.setShadow (offsetCoordinates, blurLevel, color)
#### Parameters:
- offsetCoordinates (object)
  - object { x (number) , y (number) }
- blurLevel (number)
  - Level of the blur effect on shadow.
- color (string)
  - Hexadecimal numbers or web colors.
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  game.draw.setShadow(
    {x: 10, y: 10},
    20,
    'red'
  );
  
  ce.draw.arc({x: 250, y: 250}, 100, 'fill');
}
```

### draw.unsetShadow ()
#### Parameters:
- Void
#### Example:
```javascript
const ce = EvanBrosCE.init();

const render = () => {
  game.draw.setShadow(
    {x: 10, y: 10},
    20,
    'red'
  );
  
  ce.draw.arc({x: 250, y: 250}, 100, 'fill');
  
  game.draw.unsetShadow();

  game.draw.rectangle({x: 400, y: 150, width: 200, height: 200}, 'fill');
}
```

## EvanBrosCE Sound Methods
### sound.playSound (sound)
#### Parameters:
- sound (assets):
  - EvanBrosCE.assets['LOADED_SOUND_NAME']
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadSound("sound1", "sounds/sound1.mp3");
}

const render = () => {
  ce.sound.playSound(
    ce.assets['sound1'],
  );
}
```

### sound.stopSound (sound)
#### Parameters:
- sound (assets):
  - EvanBrosCE.assets['LOADED_SOUND_NAME']
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadSound("sound1", "sounds/sound1.mp3");
}

const render = () => {
  if(something) {
    ce.sound.playSound(
      ce.assets['sound1'],
    );
  }
  
  if(situation) {
    ce.sound.stopSound(
      ce.assets['sound1'],
    );
  }
}
```

### sound.pauseSound (sound)
#### Parameters:
- sound (assets):
  - EvanBrosCE.assets['LOADED_SOUND_NAME']
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadSound("sound1", "sounds/sound1.mp3");
}

const render = () => {
  if(something) {
    ce.sound.playSound(
      ce.assets['sound1'],
    );
  }
  
  if(situation) {
    ce.sound.pauseSound(
      ce.assets['sound1'],
    );
  }
}
```

### sound.setVolume (sound, volume)
#### Parameters:
- sound (assets):
  - EvanBrosCE.assets['LOADED_SOUND_NAME']
- volume (number)
  - From one to one hundred percent of the sound volume
#### Example:
```javascript
const ce = EvanBrosCE.init();

const load = () => {
  ce.loadSound("sound1", "sounds/sound1.mp3");
}

const render = () => {
  if(something) {
    ce.sound.playSound(
      ce.assets['sound1'],
    );
  }
  
  if(situation) {
    ce.sound.setVolume(
      ce.assets['sound1'],
      30
    );
  }
}
```

## EvanBrosCE Events Methods
### event.getMouseClick ()
#### Parameters:
- Void
#### Returns:
- object { x (float), y (float) }
#### Example:
```javascript
const ce = EvanBrosCE.init();

let mousePosition;

const load = () => {
  mousePosition = ce.events.getMouseClick();
}
```

### event.getMouseOver ()
#### Parameters:
- Void
#### Returns:
- object { x (float), y (float) }
#### Example:
```javascript
const ce = EvanBrosCE.init();

let mousePosition;

const load = () => {
  mousePosition = ce.events.getMouseOver();
}
```

### event.configKeyboardKeys (Keys)
#### Parameters:
- Keys (object)
  - object { KEY_NUMBER (object) }
    - object { press (function), release (function) }
    - The functions will be call when the button with the especific KEY_NUMBER are pressed or released
#### Example:
```javascript
const ce = EvanBrosCE.init();

let up;
let down;

const load = () => {
  ce.events.configKeyboardKeys({
    38: {press: () => {	up = true;}, release: () => { up = false; }},
    40: {press: () => {	down = true; }, release: () => { down = false; }},
  });
}

const update = () => {
  if(up) {
    //Do something
  } else if(down) {
    //Do something
  }
}
```
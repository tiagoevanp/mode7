class Draw {
  constructor(ctx, startDate, save, restore) {
    this.ctx = ctx;
    this.color = 'white';
    this.startDate = startDate;
    this.saveState = save;
    this.restoreState = restore;
  }
  setColor(color) {
    this.color = color;
  }
  
  setLinearGradient(coordinates, colors) {
    this.color = this.ctx.createLinearGradient(coordinates.x, coordinates.y, coordinates.x2, coordinates.y2);
    for (var property in colors) {
      this.color.addColorStop(colors[property]/100, property);
    }
  }

  setRadialGradient(coordinates, colors) {
    this.color = this.ctx.createRadialGradient(coordinates.x, coordinates.y, coordinates.initR, coordinates.x, coordinates.y, coordinates.endR);
    for (var property in colors) {
      this.color.addColorStop(colors[property]/100, property);
    }
  }

  setShadow(offsetCoordinates, blurLevel, color) {
    this.ctx.shadowOffsetX = offsetCoordinates.x;
    this.ctx.shadowOffsetY = offsetCoordinates.y;
    this.ctx.shadowBlur = blurLevel;
    this.ctx.shadowColor = color;
  }

  unsetShadow(){
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 0;
  }

  path(coordinates, thickness, type) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = thickness;
    this.ctx.moveTo(coordinates.x[0], coordinates.y[0]);
    for (var i = 1; i < coordinates.x.length; i++) {
      this.ctx.lineTo(coordinates.x[i], coordinates.y[i]);
    }
    if(type === "fill") {
      this.ctx.fill();
    } else if (type === "stroke") {
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  arc(coordinates, radius, type, angles = {init:0,end:360}, anticlockwise = false) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.arc(coordinates.x, coordinates.y, radius, angles.init/180*Math.PI, angles.end/180*Math.PI, anticlockwise);
    if(type === "fill") {
      this.ctx.fill();
    } else if (type === "stroke") {
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  curve(coordinates, radius, type) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.moveTo(coordinates.x[0], coordinates.y[0]);
    this.ctx.arcTo(coordinates.x[1], coordinates.y[1], coordinates.x[2], coordinates.y[2], radius);
    if(type === "fill") {
      this.ctx.fill();
    } else if (type === "stroke") {
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  rectangle(coordinates, type) {
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    if(type === "fill") {
      this.ctx.fillRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    } else if (type === "stroke") {
      this.ctx.strokeRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    } else if (type === "clear"){
      this.ctx.clearRect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
    }
  }

  text(text, coordinates, type, style) {
    this.ctx.font = style
    if (type === 'fill') {
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(text, coordinates.x, coordinates.y);
    } else if (type === 'stroke') {
      this.ctx.strokeStyle = this.color;
      this.ctx.strokeText(text, coordinates.x, coordinates.y);
    }
  }

  image(img, coordinates, alpha = 1) {
    if(img.complete) {
      var width = coordinates.width || img.width,
      height = coordinates.height || img.height;
      this.saveState();
      this.translateScreen(coordinates.x+width/2, coordinates.y+height/2);
      if(coordinates.mirror) {
        this.ctx.scale(-1, 1);
      }
      this.rotateScreen(coordinates.angle);
      this.translateScreen(-(coordinates.x+width/2), -(coordinates.y+height/2));
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(img, coordinates.x, coordinates.y, width, height);
      this.restoreState();
    }
  }

  tilemap(img, tilemap, matrix, coordinates, tileSize, alpha = 1) {
    if(img.complete) {
      this.saveState()
      this.ctx.globalAlpha = alpha;
      for(var i = 0; i < matrix[0].length; i++) {
        for(var j = 0; j < matrix.length; j++) {
          this.ctx.drawImage(img, tilemap[matrix[j][i]].x , tilemap[matrix[j][i]].y, tilemap[matrix[j][i]].width, tilemap[matrix[j][i]].height, coordinates.x+tileSize.width*i, coordinates.y+tileSize.height*j, tileSize.width, tileSize.height);
        }
      }
      this.restoreState();
    }
  }
    
  sprite(img, coordinates, sprite, frameLimit, timeToNextFrame, alpha = 1) {
    if(img.complete) {
      var nowDate = new Date(),
        timeCounter = Math.round((nowDate - this.startDate)/(1000*timeToNextFrame)),
        frame = (timeCounter % frameLimit);
        if(frame) {
          sprite.x += sprite.width*frame;
        }
      var width = coordinates.width || sprite.width,
          height = coordinates.height || sprite.height;

      this.saveState();
      this.translateScreen(coordinates.x+width/2, coordinates.y+height/2);
      if(coordinates.mirror) {
        this.ctx.scale(-1, 1);
      }
      this.rotateScreen(coordinates.angle);
      this.translateScreen(-(coordinates.x+width/2), -(coordinates.y+height/2));
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(img, sprite.x , sprite.y, sprite.width, sprite.height, coordinates.x, coordinates.y, width, height);
      this.restoreState();
    }
  }

  pattern(img, coordinates, patternSize, repetition, alpha = 1) {
    if(img.complete) {
      var patternCanvas = document.createElement('canvas');
      patternCanvas.width = patternSize.width;
      patternCanvas.height = patternSize.height;
      this.saveState();
      this.ctx.globalAlpha = alpha;
      var patternCtx = patternCanvas.getContext('2d');
      patternCtx.imageSmoothingEnabled = false;
      patternCtx.drawImage(img, 0, 0, patternSize.width, patternSize.height);
      this.ctx.fillStyle = this.ctx.createPattern(patternCanvas, repetition);
      this.ctx.translate(coordinates.x, coordinates.y);
      this.ctx.fillRect(0, 0, coordinates.width, coordinates.height);
      this.ctx.translate(-coordinates.x, -coordinates.y);
      this.restoreState();
    }
  }

  translateScreen(x, y) {
    this.ctx.translate(x, y);
  }

  rotateScreen(angle) {
    this.ctx.rotate((Math.PI/180)*angle);
  }

  transform(a, b, c, d, e, f, fn) {
    this.saveState();
		this.ctx.transform(a, b, c, d, e, f);
		fn();
		this.restoreState();
  }
}

export default Draw;
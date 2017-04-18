# Pilot.js
Pilot is a script that allows any font width, to respond to the window size. For this, it needs two fonts to make de stretch possible, since each master indicates de minimum and maximum width the font can take. </p>

This script uses the jQuery and [opentype.js](http://opentype.js.org/), witch allows to read a font data and change it.



# Getting Started
### 1. Include JQuery,Opentype.js and Pilot.js

    <script type="text/javascript" src="js/jquery.min.js"></script> 
    <script type="text/javascript" src="js/opentype_add.js"></script>
    <script type="text/javascript" src="js/pilot.js"></script>
    

### 2. Create canvas with class "canvasResponsive"
    <canvas id="canvas_id" height="120" class="canvasResponsive"><canvas>


### 3. Initialize the Pilot, indicating font to stretch and place to draw.

    var font= new Pilot({
          fonte1: 'fonts/Conc.ttf',  
          fonte2: 'fonts/nice2.ttf', 
          textToRender: "PILOT", 
          canvasID : "canvas_id" 
          
### 4. Run Pilot.
    font.runPilot();
    
    
    

# Options
### Parameters
| Name          | Default             | Type      | Description                                                          |
|---------------|---------------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FontSize     | `100`            | `number`            | Defines size o font to draw.     |
| mode     | `equal`            | `string`            | Defines what mode each letter will be stretched: `random`,`equal` ,`firstLetter` ,`lastLetter` ,`chosenLetter` and `deform`. |
| chosenLetter     | `null`            | `array`            | Defines witch letter will be stretched, in mode `chosenLetter`.|
| canvasID     | `null`            | `string`            | Link to canvas to draw.    |
| canvasWidth     | `100`            | `number`            | Indicates the size canvas.     |
| canvasWidthMode     | `percentage`            | `string`            | Indicates the type of meausure of canvas width,`percentage` or `pixels`.    |
| color     | `black`            | `string`            | Color to fill font.     |
| stroke     | `transparent`            | `string`            | Indicates the stroke color. |
| strokeWidth     | `0`            | `number`            | Indicates the stroke width. |
| animateonEnter     | `false`            | `boolean`            | Animate font stretch, when window is loaded. |
| start     | `max`            | `string`            | Where the stretch will start, with its `max` value or `min`. |


# Methods
### Get
#### `Pilot.getFontSize()`
#### `Pilot.getColor()`
#### `Pilot.getMode()`
#### `Pilot.getText()`
#### `Pilot.getColor()`
#### `Pilot.getMinWidth()`
#### `Pilot.getTotalIncrease()`
#### `Pilot.getStart()`
#### `Pilot.getLimit()`

### Change
#### `Pilot.changeCanvasWidth(width)`
#### `Pilot.changeText(text)`
#### `Pilot.changeColor(text)`
#### `Pilot.changeLetterSelected(array)`
#### `Pilot.changeMode(mode)`
#### `Pilot.changeFontSizeDraw(fontsize)`
#### `Pilot.changeCanvasWidthSetup()`
interpolate


### Other
#### `Pilot.runPilot()`
#### `Pilot.windowResized()`
#### `Pilot.reRandom()`
#### `Pilot.animate(vel, TimeoutVariable, "decrease" or "increase")`
#### `Pilot.interpolate()`





Planned
=======
* Extend variation to height

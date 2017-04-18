# Pilot.js
Pilot is a script that allows any font width, to respond to the window size. For this, it needs two fonts to make de stretch possible, since each master indicates de minimum and maximum width the font can take. 

This script uses the jQuery and [opentype.js](http://opentype.js.org/), witch allows to read a font data and change it.

<img src="https://BDiogo.github.io/pilot/img/image.png" alt="alt text" width="350" >
# About Font
For de development of this project, was used the typeface Reglo by Sebastien Sanfilippo. More about this font can be found 
[here](https://www.behance.net/gallery/3594959/Font-Reglo).

To carry out the proposed idea, was created a version o Reglo extra large and was made some small changes in some letters, so that its extension is possible.
![](http://content.altfonts.com:88/img/R/E/Reglo-Bold.png)


# How it works
## Master
## Limit
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
| Option          | Default             | Type      | Description                                                          |
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
## Get
#### `Pilot.getFontSize()`
#### `Pilot.getColor()`
#### `Pilot.getMode()`
#### `Pilot.getText()`
#### `Pilot.getColor()`
#### `Pilot.getMinWidth()`
Since the font as a minimum width, so all the word. This function returns the minimum width it needs to fill de windows, given a text to render and a font size.
#### `Pilot.getTotalIncrease()`
Gives the diference between the container width as the minimum word string, giving to total increase the font needs to suffer.
#### `Pilot.getStart()`
#### `Pilot.getLimit()`
Since the limit reffers to the percentage (from 0 to 1), of each master font to use. It can return a `number` or an `array`, depending on the mode (equal and deform return `number`, other `array`).

## Change
#### `Pilot.changeCanvasWidth(width)`
Change canvas width to the width specified, when the text doesn't  fit the canvas, will automatically decrease its font size.
#### `Pilot.changeText(text)`
Change Text to Render, recalculate widths to each letters and show it on the canvas.
#### `Pilot.changeColor(text)`
#### `Pilot.changeLetterSelected(array)`
Change letters selected for the mode `chosenLetter`.
#### `Pilot.changeMode(mode)`
#### `Pilot.changeFontSizeDraw(fontsize)`
Change font Size and draw on canvas.
#### `Pilot.changeCanvasWidthSetup()`


## Other
#### `Pilot.runPilot()`
Inicializing Pilot.
#### `Pilot.windowResized()`
Recalculates widths to each letters, according to new size of window and show it on the canvas.
#### `Pilot.reRandom()`
Makes a new random for letters, changing its widths. If mode isn't `random` will change it.
#### `Pilot.animate(velocity, TimeoutVariable, "decrease" or "increase")`
This function was created purposely for animate de font width. The `velocity`variable indicates how fast the width will descrease or increase. Once the word reaches its maximum, when `increase` and minimum when `decrease` will crear the timeout  specified. Example:

            var timeout= setInterval(function() {
                pilot.animate(10, timeout , "increase");
            },30);
        

#### `Pilot.interpolate()`
Draws in canvas, given widths for each letter.





Planned
=======
* Adapt to long strings, and break line.
* Extend variation to height

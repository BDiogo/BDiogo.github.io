# AdapType.js
AdapType is a script that allows any font width, to respond to the window size. For this, it needs TWO fonts to make de stretch possible, since each master indicates de minimum and maximum width the font can take. 
AdapType is a project thought inside the master degree in Multimedia and Design, of University of Coimbra.

        
This script uses the jQuery and [opentype.js](http://opentype.js.org/), witch allows to read a font data and change it. Some functions where added to opentype.js, so that its stretch is possible.

<img src="https://BDiogo.github.io/AdapType/img/image2.png" alt="alt text" width="350" >

The website can be found [here](http://adaptype.com/).
# Compatible Fonts
For the development of this project, was needed a typeface that would suffer the stretch by the script.


To carry out the proposed idea, was created a version of each font extra large and the needed changes, so that its stretch is possible.


Was adapted the typeface Reglo by Sebastien Sanfilippo. More about this font can be found [here](https://www.behance.net/gallery/3594959/Font-Reglo).


![](http://content.altfonts.com:88/img/R/E/Reglo-Bold.png)


# Getting Started
### 1. Include JQuery,Opentype.js and AdapType.js
    <script type="text/javascript" src="PATH_TO/jquery.min.js"></script> 
    <script type="text/javascript" src="PATH_TO/opentype_add.js"></script>
    <script type="text/javascript" src="PATH_TO/AdapType.js"></script>
    

### 2. Create canvas
    <canvas id="canvas_id"><canvas>


### 3. Initialize the AdapType, indicating font to stretch and place to draw.

    var font= new AdapType({
        fonts:[{"font1":"PATH_FONT_REGULAR", "font2":"PATH_FONT_EXPANDED"}], 
        textToRender: "PLACE_TEXT_HERE", 
        canvasID : "CANVAS_ID" 
    )};  
          
### 4. Run AdapType.
    font.runAdapType();
    
    
### 5. Make it Responsive when window resized(optional).   
    $( window ).resize(function() {   
        font.changeCanvasWidthSetup();
        font.windowResized();

    });

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
| start     | `max`            | `string`            | Where the stretch will start, with its `max` value or `min`. |
| exponential NEW     | `true`            | `boolean`            |  Describes the line spacing is the vertical distance between lines of text.|


# Methods
## Get
#### `AdapType.getFontSize()`
#### `AdapType.getColor()`
#### `AdapType.getMode()`
#### `AdapType.getText()`
#### `AdapType.getColor()`
#### `AdapType.getMinWidth()`
Since the font as a minimum width, so all the word. This function returns the minimum width it needs to fill de windows, given a text to render and a font size.
#### `AdapType.getTotalIncrease()`
Gives the diference between the container width as the minimum word string, giving to total increase the font needs to suffer.
#### `AdapType.getStart()`
#### `AdapType.getLimit()`
Since the limit reffers to the percentage (from 0 to 1), of each master font to use. It can return a `number` or an `array`, depending on the mode (equal and deform return `number`, other `array`).
#### `AdapType.getLoaded()`
Returns e AdapType was completly loaded (0 for no, 1 for yes). Important when runing functions (like AdapType.changeText()) on window loaded, since JavaScript is asynchronous it will run any function, even if all the information is not ready (usually return error: <b>this.font1.checkWords is not a function </b>). It may be implemented like the folowing code: 

            if(AdapType.getLoaded==1){
                AdapType.changeText("new text");
            }
For button events, this function will not be necessary.
#### `AdapType.getExponential()` NEW
#### `AdapType.getCanvasWidth()` NEW
Returns the canvas width with chosen mode.
#### `AdapType.getCanvasID()` 
Returns the canvas id.
#### `AdapType.getMinWidthPx()` NEW
Returns the canvas width in pixels.
#### `AdapType.getMinWidthPer()` NEW
Returns the canvas width with in percentage.


## Change
#### `AdapType.changeCanvasWidth(width)`
Change canvas width to the width specified, when the text doesn't  fit the canvas, will automatically decrease its font size.
#### `AdapType.changeText(text)`
Change Text to Render, recalculate widths to each letters and show it on the canvas.
#### `AdapType.changeColor(text)`
#### `AdapType.changeLetterSelected(array)`
Change letters selected for the mode `chosenLetter`.
#### `AdapType.changeMode(mode)`
#### `AdapType.changeFontSizeDraw(fontsize)`
Change font Size and draw on canvas.
#### `AdapType.changeCanvasWidthSetup()`
#### `AdapType.changeExponential(boolean) NEW`


## Other
#### `AdapType.runAdapType()`
Inicializing AdapType.
#### `AdapType.windowResized()`
Recalculates widths to each letters, according to new size of window and show it on the canvas.
#### `AdapType.reRandom()`
Makes a new random for letters, changing its widths. If mode isn't `random` will change it.
#### `AdapType.animateFromTo(VEL,TO, ANIMATING_MODE)` UPDATED
Animates current width to new width. When decreasing width prevents from going beyond min width of the font, established by Font 1.
            //VEL – velocity of animation
            //TO – width to animate (ex: 100);
            //ANIMATING_MODE – mode of animation (“easeIn”, “easeOut”, “easeInOut” and “linear”)
        



#### `AdapType.interpolate()`
Draws in canvas, given widths for each letter.





Planned
=======
- [ ] Make it work without a canvas. NEW
- [ ] Adapt to long strings, and break line.
- [ ] Create version to along font height.
- [x] Perfect animation.
- [x] More fonts already adapted to be used in script.

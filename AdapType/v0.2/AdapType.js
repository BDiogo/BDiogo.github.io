//-----------------------------------------
//-----------------------------------------
//Inicializing AdapType
//-----------------------------------------
//-----------------------------------------
//MANDATORY VARIABLES:
//-- fonte1= FONTE CONDENSED (MINIMUM); 
//-- fonte2= FONTE EXPANDED  (MAXIMUM) (unless a deformation is what is espected); 
//-- fontSize; 
//-- canvasID - where to draw; 
//-- textToRender; 
//-- if mode= chosenLetter, chosenLetters is mandatory (example: [1,5,6]);
//OPTIONA VARIABLES:
//-- mode DEFAULT equal if font2 is defined, otherwise DEFAULT is deform; 
//-- kerning DEFAULT true; 
//-- ligatures DEFAULT true; 
//-- button DEFAULT false; 
//-- animateonEnter DEFAULT false; 
function AdapType(e) {
    this.max = {};
    this.min = {};
    this.d = {};
    this.a = -10;

    this.options;
    this.kerning = true;
    this.ligatures = true;
    this.countours = [];
    this.countArr = 0;
    this.count_fonts = 0;
    this.pageSelected;
    this.fontScale;
    this.fontBaseline;
    this.glyphScale;
    this.glyphSize;
    this.glyphBaseline;

    this.font1 = "1";
    this.font2 = "2";

    this.fontFileName1;
    this.fontFileName2;
    this.limit;
    this.fontSize;
    this.textToRender;
    this.percentage;
    this.animateonEnter;
    this.canvas;
    this.snapCtx;
    this.width;
    this.height;
    this.mode;
    this.color;
    this.chosenLetters = 0;
    this.error = [];
    this.percentagaPerLetter = [];
    this.animateValue = 0;
    this.loaded = 0;
    this.animating = false;



    this.fonts = new Array();
    this.fonts_info = new Array();
    this.selected_font = 1;

    e = e || {};
    if (!e.empty) {
        if (e.lineHeight === undefined) {
            this.lineHeight = 1.2;
        } else {
            this.lineHeight = e.lineHeight + 0.01;
        }


        if (e.color === undefined) {
            this.color = "black";
        } else {
            this.color = e.color;
        }
        if (e.exponential === undefined) {
            this.exponential = true;
        } else {
            this.exponential = e.exponential;
        }


        if (e.fonte1 === undefined) {
            if (e.fonts === undefined) {
                error.push("Font 1 not defined!");
            }
        } else {
            this.fontFileName1 = e.fonte1;
        }

        if (e.fonte2 === undefined && e.fonte1 !== undefined) {
            this.mode = "deform";
        } else if (e.fonte2 === undefined) {
            if (e.fonts === undefined) {
                this.error.push("Font 2 not defined!");
            }
        } else {
            this.fontFileName2 = e.fonte2;
        }

        if (e.fonts === undefined) {
            console.log("Font not defined");

        } else {

            for (var f = 0; f < e.fonts.length; f++) {
                this.fonts.push([]);
            }
            for (var f = 0; f < e.fonts.length; f++) {
                this.fonts[f].push(e.fonts[f].font1);
                this.fonts[f].push(e.fonts[f].font2);
            }


        }
        if (e.strokeWidth === undefined) {
            this.strokeWidth = 0;
        } else {
            this.strokeWidth = e.strokeWidth;
        }


        if (e.stroke === undefined) {
            this.stroke = "transparent";
        } else {
            this.stroke = e.stroke;
        }


        if (e.mode !== undefined) {
            if (e.fonte2 === undefined && e.fonte1 !== undefined) {
                this.mode = "deform";
            } else {
                if (e.mode != "firstLetter" && e.mode != "equal" && e.mode != "random" && e.mode != "firstLetter" &&
                    e.mode != "lastLetter" && e.mode != "middleLetter" && e.mode != "chosenLetter" && e.mode != "deform") {
                    if (e.fonte2 === undefined) {
                        this.mode = "deform";
                    } else {
                        this.mode = "random";
                    }
                } else {
                    this.mode = e.mode;
                    if (this.mode == "chosenLetter") {
                        if (e.chosenLetters !== undefined) {
                            this.chosenLetters = [];
                            for (var i = 0; i < e.chosenLetters.length; i++) {
                                if (e.chosenLetters[i] <= e.textToRender.length) {
                                    this.chosenLetters.push(e.chosenLetters[i]);
                                }
                            }
                        } else {
                            this.error.push("Need to chose the letter to stretch!");
                        }
                    }
                }

            }
        } else {
            this.mode = "equal";
        }


        if (e.start !== undefined) {
            this.start = e.start;
        } else {
            this.start = "max";

        }


        if (e.fontSize !== undefined) {
            this.boxHeight = e.fontSize;
            this.fontSize = e.fontSize;
        } else {
            this.fontSize = 100;
            this.boxHeight = 100;

        }
        if (e.textToRender !== undefined) {
            this.textToRender = e.textToRender;
        } else {
            this.error.push("Text to Render is not defined!");

        }
        if (e.canvasWidthMode !== undefined) {
            if (e.canvasWidthMode == "percentage" || e.canvasWidthMode == "pixels") {
                this.WidthMode = e.canvasWidthMode;

            } else {
                this.WidthMode = "percentage";
            }

        } else {
            this.WidthMode = "percentage";


        }

        if (e.canvasID !== undefined) {
            if ($("#" + e.canvasID).is("canvas")) {
                this.canvasID = e.canvasID;
                this.canvas = document.getElementById(e.canvasID);
                this.snapCtx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = e.fontSize * this.lineHeight;

                $("#" + this.canvasID).attr("height", this.height);
                if (e.canvasWidth !== undefined) {
                    this.canvasWidth = e.canvasWidth;
                } else {
                    this.canvasWidth = 100;

                }
            } else {
                this.error.push("The ID of the element, is not a canvas!");
            }
        } else {
            this.error.push("Id of canvas to draw is not defined!");

        }
        if (e.animateonEnter !== undefined) {
            this.animateonEnter = e.animateonEnter;
        } else {
            this.animateonEnter = false;

        }


        this.limit = 1;
        this.percentage = 0;
    }



    this.options = {
        kerning: this.kerning,
        features: {
            liga: this.ligatures,
            rlig: this.ligatures
        }
    };

}

//change width of canvas
AdapType.prototype.changeCanvasWidthDraw = function(measure) {
    var canva = $("#" + this.canvasID);
    if (this.WidthMode == "percentage") {
        var width = $(window).width() * measure / 100;
    } else {
        var width = measure;
    }
    this.canvasWidth = measure;
    canva.attr("width", width);
    this.getLimit();
    this.interpolate();


}
//change width of canvas
AdapType.prototype.changeCanvasWidth = function(measure) {
    var canva = $("#" + this.canvasID);
    if (this.WidthMode == "percentage") {
        var width = $(window).width() * measure / 100;
    } else {
        var width = measure;
    }
    canva.attr("width", width);


}
//change width of canvas setup
AdapType.prototype.changeCanvasWidthSetup = function() {
    var canva = $("#" + this.canvasID);
    if (this.WidthMode == "percentage") {
        var width = $(window).width() * this.canvasWidth / 100;

    } else {
        var width = this.canvasWidth;

    }
    canva.attr("width", width);

}
//change width of get if animate is true
AdapType.prototype.getAnimate = function() {
    return this.animateonEnter;

}

//change width of get if animate is true
AdapType.prototype.getFontSize = function() {
    return this.fontSize;

}

//change width of get if animate is true
AdapType.prototype.setFontSize = function(size) {
    this.fontSize = size;

}



function linearTween(t, b, c, d) {
    var value = c * t / d + b;
    return value;
};

function easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    var value = c * (t * t * t + 1) + b;

    return value;
};

function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
};



function easeInCubic(t, b, c, d) {
    t /= d;
    return c * t * t * t + b;
};



//animation 
AdapType.prototype.animateFromTo = function(v, to, m) {

    if (m === undefined && m != "easeOut" && m != "easeIn" && m != "easeInOut") {
        var mode = "linear";
    } else {
        mode = m;

    }
    if (this.animating == false) {
        this.animating = true;
        var min_width = this.getMinWidth();
        var vel = v;
        var frameRate = 30;
        var interval = 1000 / frameRate;
        var max_container_px = $(window).width() * this.canvasWidth / 100;
        var max_container_per = this.canvasWidth;

        var min_width_px = this.getMinWidth();
        var min_width_per = (min_width_px) * max_container_per / max_container_px;

        var from;

        if (this.start == "min") {
            from = min_width_per;

        } else {
            from = max_container_per;

        }
        if (to <= min_width_per) {
            to = min_width_per;

        }
        var newWidth = from;

        var that = this;

        // variable for functions
        if (to > from) {
            var diference = Math.abs(to - from);

        } else {
            var diference = Math.abs(from - to);
        }
        var d = diference / vel;

        var t = 0;

        //var notawhileloop = setInterval(this.animateCalculus(from,to,newWidth,vel), interval);
        var notawhileloop = setInterval(function() {
            // INCREASE
            if (from < to) {
                if (to <= newWidth) {
                    clearInterval(notawhileloop);
                    that.animating = false;
                    that.canvasWidth = to;

                } else {
                    switch (mode) {
                        case "linear":
                        if (to <= linearTween(t, from, vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, vel, d);
                        }
                        break;


                        case "easeIn":
                        if (to <= easeInCubic(t, from, vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInCubic(t, from, vel, d);
                        }
                        break;

                        case "easeOut":
                        if (to <= easeOutCubic(t, from, vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeOutCubic(t, from, vel, d);
                        }
                        break;

                        case "easeInOut":
                        if (to <= easeInOutCubic(t, from, vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInOutCubic(t, from, vel, d);
                        }
                        break;

                        default:
                        if (to <= linearTween(t, from, vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, vel, d);
                        }
                    }

                    that.changeCanvasWidth(newWidth);
                    that.windowResized();
                }

                // DECREASE
            } else if (to < from) {
                if (to >= newWidth) {
                    clearInterval(notawhileloop);
                    that.animating = false;
                    that.canvasWidth = to;

                } else {
                    switch (mode) {
                        case "linear":
                        if (to >= linearTween(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, -vel, d);
                        }
                        break;

                        case "easeIn":
                        if (to >= easeInCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInCubic(t, from, -vel, d);
                        }
                        break;

                        case "easeOut":
                        if (to >= easeOutCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeOutCubic(t, from, -vel, d);
                        }
                        break;

                        case "easeInOut":
                        if (to >= easeInOutCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInOutCubic(t, from, -vel, d);
                        }
                        break;

                        default:
                        if (to >= linearTween(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, -vel, d);
                        }
                    }

                    that.changeCanvasWidth(newWidth);
                    that.windowResized();
                }


            } else {
                that.animating = false;
                //console.log("two are the same");
            }
            t++;

        }, interval);
}
}




//animation 
AdapType.prototype.animateBounce = function(velocity, max, mode) {

    var m = mode;
    var to = max;
    if (m === undefined && m != "easeOut" && m != "easeIn" && m != "easeInOut") {
        var mode = "linear";
    } else {
        mode = m;

    }

    var stage = 0;

    if (this.animating == false) {
        this.animating = true;
        var min_width = this.getMinWidth();
        var vel = velocity;
        var frameRate = 30;
        var interval = 1000 / frameRate;

        var max_container_px = $(window).width() * this.canvasWidth / 100;
        var max_container_per = this.canvasWidth;

        var min_width_px = this.getMinWidth();
        var min_width_per = (min_width_px) * max_container_per / max_container_px;

        var from;

        if (this.start == "min") {
            from = min_width_per;

        } else {
            from = max_container_per;

        }
        if (to <= min_width_per) {
            to = min_width_per;

        }
        var newWidth = from;
        var that = this;

        // variable for functions
        if (to > from) {
            var diference = Math.abs(to - from);

        } else {
            var diference = Math.abs(from - to);
        }
        var d = diference / vel;

        var t = 0;

        //var notawhileloop = setInterval(this.animateCalculus(from,to,newWidth,vel), interval);
        var notawhileloop = setInterval(function() {
            // INCREASE
            if (from < to) {
                //console.log("increase");

                if (stage == 0) {
                    if (to <= newWidth) {
                        //clearInterval(notawhileloop);
                        //that.animating=false;


                        that.canvasWidth = to;
                        stage++;
                        t = 0;
                    } else {
                        switch (mode) {
                            case "linear":
                            if (to <= linearTween(t, from, vel, d)) {
                                newWidth = to;
                            } else {
                                newWidth = linearTween(t, from, vel, d);
                            }
                            break;


                            case "easeIn":
                            if (to <= easeInCubic(t, from, vel, d)) {
                                newWidth = to;
                            } else {
                                newWidth = easeInCubic(t, from, vel, d);
                            }
                            break;

                            case "easeOut":
                            if (to <= easeOutCubic(t, from, vel, d)) {
                                newWidth = to;
                            } else {
                                newWidth = easeOutCubic(t, from, vel, d);
                            }
                            break;

                            case "easeInOut":
                            if (to <= easeInOutCubic(t, from, vel, d)) {
                                newWidth = to;
                            } else {
                                newWidth = easeInOutCubic(t, from, vel, d);
                            }
                            break;

                            default:
                            if (to <= linearTween(t, from, vel, d)) {
                                newWidth = to;
                            } else {
                                newWidth = linearTween(t, from, vel, d);
                            }
                        }

                        that.changeCanvasWidth(newWidth);
                        that.windowResized();
                    }
                } else {

                    //from = new to

                    //BOUNCE BACK
                    if (newWidth <= min_width_per) {
                        clearInterval(notawhileloop);
                        that.animating = false;
                        that.canvasWidth = to;

                    } else {
                        switch (mode) {
                            case "linear":
                            if (min_width_per >= linearTween(t, newWidth, -vel, d)) {
                                newWidth = min_width_per;
                            } else {
                                newWidth = linearTween(t, newWidth, -vel, d);
                            }
                            break;


                            case "easeIn":
                            if (min_width_per >= easeInCubic(t, newWidth, -vel, d)) {
                                newWidth = min_width_per;
                            } else {
                                newWidth = easeInCubic(t, newWidth, -vel, d);
                            }
                            break;

                            case "easeOut":
                            if (min_width_per >= easeOutCubic(t, newWidth, -vel, d)) {
                                newWidth = min_width_per;
                            } else {
                                newWidth = easeOutCubic(t, newWidth, -vel, d);
                            }
                            break;

                            case "easeInOut":
                            if (min_width_per >= easeInOutCubic(t, newWidth, -vel, d)) {
                                newWidth = min_width_per;
                            } else {
                                newWidth = easeInOutCubic(t, newWidth, -vel, d);
                            }
                            break;

                            default:
                            if (min_width_per >= linearTween(t, newWidth, -vel, d)) {
                                newWidth = min_width_per;
                            } else {
                                newWidth = linearTween(t, from, -vel, d);
                            }
                        }

                        that.changeCanvasWidth(newWidth);
                        that.windowResized();
                    }
                }
                // DECREASE
            } else if (to < from) {
                if (to >= newWidth) {
                    // clearInterval(notawhileloop);
                    // that.animating=false;
                    that.canvasWidth = to;

                } else {
                    switch (mode) {
                        case "linear":
                        if (to >= linearTween(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, -vel, d);
                        }
                        break;

                        case "easeIn":
                        if (to >= easeInCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInCubic(t, from, -vel, d);
                        }
                        break;

                        case "easeOut":
                        if (to >= easeOutCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeOutCubic(t, from, -vel, d);
                        }
                        break;

                        case "easeInOut":
                        if (to >= easeInOutCubic(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = easeInOutCubic(t, from, -vel, d);
                        }
                        break;

                        default:
                        if (to >= linearTween(t, from, -vel, d)) {
                            newWidth = to;
                        } else {
                            newWidth = linearTween(t, from, -vel, d);
                        }
                    }

                    that.changeCanvasWidth(newWidth);
                    that.windowResized();
                }


            } else {
                that.animating = false;
                //console.log("two are the same");
            }
            t++;

        }, interval);
}
}


//do animation
AdapType.prototype.animate = function(increase, a, animation) {
    var min_width = this.getMinWidth();
    if (animation == "increase") {
        this.animateValue += increase;
    } else {
        this.animateValue -= increase;
    }


    if (this.WidthMode == "percentage") {
        var max_container = $(window).width() * this.canvasWidth / 100;
    } else {
        var max_container = this.canvasWidth;

    }


    if (this.animateValue <= 0 && animation == "decrease") {
        this.setWithMin();
        this.animateValue = 0;
        clearInterval(a);
    } else if (this.animateValue >= max_container && animation == "increase") {
        this.animateValue = max_container - min_width;
        clearInterval(a);
    } else {
        var percentage_min = (min_width + this.animateValue) / max_container * 100;

        if (percentage_min > this.canvasWidth) {
            percentage_min = this.canvasWidth;
            if (this.start == "min") {
                clearInterval(a);
            }
        }


        this.changeCanvasWidth(percentage_min);
        this.windowResized();
    }
};

//do animation
AdapType.prototype.getTotalIncrease = function(increase, a) {
    var min_width = this.getMinWidth();
    if (this.WidthMode == "percentage") {
        var max_container = $(window).width() * this.canvasWidth / 100;
    } else {
        var max_container = this.canvasWidth

    }

    var TotalIncrease = max_container - min_width;
    return TotalIncrease;

};



AdapType.prototype.setWithMin = function() {
    var min_width = this.getMinWidth();

    if (this.WidthMode == "percentage") {
        var max_container = $(window).width() * this.canvasWidth / 100;
    } else {
        var max_container = this.canvasWidth;

    }
    var max_width = this.canvasWidth;
    //var percentage_min= (min_width)/max_container*100;
    var percentage_min = min_width * this.canvasWidth / max_container;

    if (min_width > max_container) {
        percentage_min = this.canvasWidth;
    }

    this.changeCanvasWidth(percentage_min);
    this.windowResized();


};


AdapType.prototype.setWith = function(width, mode) {
    var min_width = this.getMinWidth();
    var percentage_min = min_width * this.canvasWidth / max_container;

    if (this.WidthMode == "percentage") {
        var max_container = $(window).width() * this.canvasWidth / 100;
    } else {
        var max_container = this.canvasWidth;

    }
    var max_width = this.canvasWidth;
    if (mode == "pixels") {
        var percentage = width * this.canvasWidth / max_container;

    } else {
        var percentage = width;

    }

    if (percentage < percentage_min) {
        percentage = percentage_min;
    }

    this.changeCanvasWidth(percentage_min);
    this.windowResized();


};

//Snap paths to mode deform
AdapType.prototype.getMinWidth = function() {
    var min_width = 0;

    min_width = this.font1.checkWords(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

    return min_width;


};

AdapType.prototype.getMinWidthPx = function() {
    var min_width = 0;

    min_width = this.font1.checkWords(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

    return min_width;


};

AdapType.prototype.getMinWidthPer = function() {
    var min_width = 0;
    var max_container_px = $(window).width() * this.canvasWidth / 100;
    var max_container_per = this.canvasWidth;

    var min_width_px = this.font1.checkWords(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
    var min_width_per = (min_width_px) * max_container_per / max_container_px;



    return min_width_per;


};
//Snap paths to mode deform
AdapType.prototype.getStart = function() {
    return this.start;


};

AdapType.prototype.getCanvasWidth = function() {
    return this.canvasWidth;


};

AdapType.prototype.getCanvasWidthMode = function() {
    return this.canvasWidthMode;


};

AdapType.prototype.getCanvasID = function() {
    return this.canvasID;


};


//load fonts
AdapType.prototype.runAdapType = function() {
    var FontResp = this;
    this.changeCanvasWidthSetup();

    if (this.error.length == 0) {
        var f = 0;

        opentype.load(this.fonts[f][0], function(err, font) {
            var amount, glyph, ctx, x, y, fontSize;
            if (err) {
                showErrorMessage(err.toString());
                return;
            }
            FontResp.onFontLoaded(font, 1, f);



        });
        opentype.load(this.fonts[f][1], function(err, font) {
            var amount, glyph, ctx, x, y, fontSize;
            if (err) {
                showErrorMessage(err.toString());
                return;
            }

            FontResp.onFontLoaded(font, 2, f);


        });

        if (this.fonts.length > 1) {
            var m = 1;
            /*
            opentype.load(this.fonts[m][0], function(err, font) {
                var amount, glyph, ctx, x, y, fontSize;
                if (err) {
                    showErrorMessage(err.toString());
                    return;
                }
                FontResp.onFontLoaded(font, 1, m);



            });
            opentype.load(this.fonts[m][1], function(err, font) {
                var amount, glyph, ctx, x, y, fontSize;
                if (err) {
                    showErrorMessage(err.toString());
                    return;
                }

                FontResp.onFontLoaded(font, 2, m);


            });
*/
}



} else {
    var warning = "";
    for (var i = 0; i < this.error.length; i++) {
        warning += i + 1 + ".  " + this.error[i] + "\n";

    }
    alert(warning);
}

};



//on fonts loaded
AdapType.prototype.onFontLoaded = function(font, x, f) {
    this.fonts_info.push(font);
    //console.log(f);
    //console.log("--------------");
    if (f == 0) {
        if (x == 1) {
            this.font1 = font;
        } else {
            if (this.mode != "deform") {
                this.font2 = font;
            }

        }



        window.font = font;
        var width = this.width;
        var height = this.height;
        var str = this.textToRender;

        this.countArr = 0;
        this.count_fonts++;



        if (this.count_fonts >= 2 && this.mode != "deform" || this.mode == "deform") {
            this.getLimit();
            if (this.start == "min" || this.animateonEnter == true) {
                this.setWithMin();
            }

            this.interpolate();

        }
    }
};
//error on font loaded
AdapType.prototype.showErrorMessage = function(message) {
    var el = document.getElementById('message');
    if (!message || message.trim().length === 0) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
    el.innerHTML = message;
};


AdapType.prototype.pathCommandToString = function(cmd) {
    var str = '<strong>' + cmd.type + '</strong> ' +
    ((cmd.x !== undefined) ? 'x=' + cmd.x + ' y=' + cmd.y + ' ' : '') +
    ((cmd.x1 !== undefined) ? 'x1=' + cmd.x1 + ' y1=' + cmd.y1 + ' ' : '') +
    ((cmd.x2 !== undefined) ? 'x2=' + cmd.x2 + ' y2=' + cmd.y2 : '');
    return str;
};

//glyphs form
AdapType.prototype.contourToString = function(contour) {
    return '<pre class="contour">' + contour.map(function(point) {
        return '<span class="' + (point.onCurve ? 'on' : 'off') + 'curve">x=' + point.x + ' y=' + point.y + '</span>';
    }).join('\n') + '</pre>';
};

//formatUnicode
AdapType.prototype.formatUnicode = function(unicode) {
    unicode = unicode.toString(16);
    if (unicode.length > 4) {
        return ("000000" + unicode.toUpperCase()).substr(-6)
    } else {
        return ("0000" + unicode.toUpperCase()).substr(-4)
    }
};

//Snap paths to mode deform
AdapType.prototype.deform = function(path1) {
    var i;
    path1.fill = this.color;
    path1.stroke = this.stroke;
    path1.strokeWidth = this.strokeWidth;
    for (var i = 0; i < path1.commands.length; i++) {
        var cmd1 = path1.commands[i];
        var result;
        cmd1.fill = this.color;
        if (cmd1.type !== 'Z') {
            cmd1.x = cmd1.x * this.percentage;
        }
        if (cmd1.type === 'Q' || cmd1.type === 'C') {
            cmd1.x1 = cmd1.x1 * this.percentage;
        }
        if (cmd1.type === 'C') {
            cmd1.x2 = cmd1.x2 * this.percentage;

        }

    }


};



//Snap paths to mode equal
AdapType.prototype.doSnap = function(path1, path2) {
    var i;
    path1.fill = this.color;
    path1.stroke = this.stroke;
    path1.strokeWidth = this.strokeWidth;

    if (path1.commands.length > 0) {
        for (var i = 0; i < path1.commands.length; i++) {
            var cmd1 = path1.commands[i];
            var cmd2 = path2.commands[i];
            var result;
            cmd1.fill = this.color;
            cmd1.stroke = this.stroke;
            cmd1.strokeWidth = this.strokeWidth;

            // if this point is the same in the two fonts, if not it means the 2 fonts don't have equivalent letters.
            if (cmd1.type === cmd2.type) {
                if (cmd1.type !== 'Z') {
                    cmd1.x = cmd1.x + ((cmd2.x - cmd1.x) * this.percentage);
                    if (this.exponential == true) {
                        if (cmd1.y != cmd2.y) {
                            if (this.a[i] === undefined) {
                                this.max[i] = cmd1.y;
                                this.min[i] = cmd2.y;
                                this.d[i] = (this.max[i] - this.min[i]) * Math.exp(this.a * this.percentage);
                            }

                            cmd1.y = this.d[i] * Math.exp(this.a * this.percentage) + this.min[i];

                        }
                    } else {
                        cmd1.y = cmd1.y + ((cmd2.y - cmd1.y) * this.percentage);

                    }
                }

                //--------x1
                if (cmd2.x1 !== undefined && cmd1.x1 !== undefined) {
                    if (cmd2.x1 != cmd1.x1) {
                        cmd1.x1 = cmd1.x1 + ((cmd2.x1 - cmd1.x1) * this.percentage);

                    }
                }
                //--------y1
                if (cmd2.y1 !== undefined && cmd1.y1 !== undefined) {
                    if (cmd2.y1 != cmd1.y1) {}
                }
            if (cmd1.type === 'Q' || cmd1.type === 'C') {}
                if (cmd1.type === 'C') {

                }

            } else {
                console.log("Fonts not Compatible!Check if both fonts have the same quantity of points!");
            }

        }
    }
};
//Snap paths for other modes
AdapType.prototype.doSnaperLetter = function(p1, p2) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    if (this.mode != "equal" && this.mode != "deform") {
        var i;
        var start = 0;
        var BoundingBox = 0;


        for (var m = 0; m < p1.length; m++) {
            var path1 = p1[m];
            var path2 = p2[m];


            p1[m].fill = this.color;
            p1[m].stroke = this.stroke;
            p1[m].strokeWidth = this.strokeWidth;
            for (var i = 0; i < path1.commands.length; i++) {
                var cmd1 = path1.commands[i];
                var cmd2 = path2.commands[i];


                if (cmd1.type === cmd2.type) {
                    cmd1.x = cmd1.x;
                    cmd1.y = cmd1.y;

                    if (cmd1.type !== 'Z') {
                        cmd1.x = (cmd1.x + ((cmd2.x - cmd1.x) * this.percentage[m]));
                        if (cmd1.y != cmd2.y) {
                            if (this.a[i] === undefined) {
                                this.max[i] = cmd1.y;
                                this.min[i] = cmd2.y;
                                this.d[i] = (this.max[i] - this.min[i]) * Math.exp(this.a * this.percentage[m]);
                            }

                            cmd1.y = this.d[i] * Math.exp(this.a * this.percentage[m]) + this.min[i];


                        }
                    }



                    if (cmd1.type === 'Q' || cmd1.type === 'C') {
                        if (cmd2.x1 != cmd1.x1) {
                            cmd1.x1 = cmd1.x1 + ((cmd2.x1 - cmd1.x1) * this.percentage[m]);

                        }
                        if (cmd2.y1 != cmd1.y1) {
                            cmd1.y1 = this.d[i] * Math.exp(this.a * this.percentage) + this.min[i];

                        }

                    }
                    if (cmd1.type === 'C') {
                        cmd1.x2 = cmd1.x2 + ((cmd2.x2 - cmd1.x2) * this.percentage[m]);


                    }



                } else {
                    alert("Need to check if font as the same points\nIn glyph " + glyphs[m].name);
                }


            }

        }
    } else {
        this.doSnap(p1, p2);
    }
};

//WHEN WINDOW RESIZED
//--change canvas wisth
//--recalculate limits for each letter
//--redraw paths of glyphs
AdapType.prototype.windowResized = function() {
    this.snapCtx = this.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.getLimit();
    this.interpolate();

};

AdapType.prototype.changeFontSizeDraw = function(size) {
    this.fontSize = size;

    this.canvas.height =  size * this.lineHeight;
    this.height = size * this.lineHeight;
    this.boxHeight= size;
    this.getLimit();
    this.interpolate();

};
//Draw paths of glyphs
AdapType.prototype.interpolate = function() {
    var snapPath_master1, snapPath_master2;
    var snapPath_master1_array, snapPath_master2_array;
    if (this.mode != "equal" && this.mode != "deform") {
        var last_b;
        this.percentage = this.getPercentageForLetters();
        snapPath_master1_array = this.font1.getPathLetter(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
        snapPath_master2_array = this.font2.getPathLetter(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
        this.doSnaperLetter(snapPath_master1_array, snapPath_master2_array);

        this.snapCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var last = 0;

        var glyphs = this.font1.stringToGlyphs(this.textToRender);


        var metrics_leftSideBearing = 0;
        var metrics_rightSideBearing = 0;

        var convert_leftSideBearing = 0;
        var convert_rightSideBearing = 0;
        var converted_kerning = 0;
        var kerning = 0;

        var b;
        var B_size_x=0;


        // run all letters to draw
        for (var i = 0; i < snapPath_master1_array.length; i++) {
            var b = snapPath_master1_array[i].getBoundingBox();
            var int_length = snapPath_master1_array.length - 1;

            //var B_size_x= 0;
            if (i == 0) {
                last = 0;
            } else {

                kerning = this.font1.getKerningValue(glyphs[i - 1], glyphs[i]);
                converted_kerning = this.convertMeasure(kerning);

                metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
                convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);

                metrics_rightSideBearing = glyphs[i - 1].getMetrics().rightSideBearing;
                convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);


                // encontrar espaço a não ocupar por letras anteriores


                if (glyphs[i - 1].name == "space") {
                    var space_whith = glyphs[i - 1].advanceWidth;
                    var space_convert = this.convertMeasure(space_whith);
                    last += space_convert;

                }
            }
            //console.log(convert_leftSideBearing);
            //console.log(convert_rightSideBearing);

            B_size_x = b.x2-b.x1;
            for (var k = 0; k < snapPath_master1_array[i].commands.length; k++) {
                var point = snapPath_master1_array[i].commands[k];
                if (point.type !== 'Z') {
                    point.x += last+converted_kerning;
                }
                if (point.type === 'Q' || point.type === 'C') {
                    point.x1 += last+converted_kerning;
                }
                if (point.type === 'C') {
                    point.x2 += last+converted_kerning;

                }
            }
            last += b.x2+convert_rightSideBearing;

            // save information of last letter;
            last_b = snapPath_master1_array[i].getBoundingBox();

            // draw this letter
            snapPath_master1_array[i].draw(this.snapCtx);

        }


    } else if (this.mode == "equal") {
        snapPath_master1 = this.font1.getPath(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
        snapPath_master2 = this.font2.getPath(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

        this.percentage = this.getPercentage();
        this.doSnap(snapPath_master1, snapPath_master2);
        this.snapCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        snapPath_master1.draw(this.snapCtx);
    } else {
        snapPath_master1 = this.font1.getPath(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

        this.percentage = this.getPercentage();
        this.deform(snapPath_master1);
        this.snapCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        snapPath_master1.draw(this.snapCtx);

    }
    this.loaded = 1;




};
AdapType.prototype.getLoaded = function() {
    return this.loaded;
}

//DIVIDE string to array of strings, where each fill window width
AdapType.prototype.dividString = function(string) {
    var max_container = this.canvas.offsetWidth;
    var splited = string.split(" ");
    var min_width = this.getMinWidth();
    var divided = new Array();
    var min_width_string = 0;
    var string_total = 0;

    var string = "";
    if (min_width >= max_container) {
        for (var i = 0; i < splited.length; i++) {
            min_width_string = this.font1.checkWords(splited[i], 0, this.boxHeight, this.fontSize, this.options);


            if (string_total + min_width_string > max_container) {
                divided.push(string);
                string = splited[i] + " ";
                string_total = min_width_string;
            } else {
                string += splited[i] + " ";
                string_total += min_width_string;


            }
            if (i == splited.length - 1) {
                divided.push(string);
            }

        }

    }
    return divided;
};

//recalc percentage for letters
AdapType.prototype.getPercentageForLetters = function() {
    var result_percentage = new Array();
    if (this.mode != "equal" || this.mode != "deform") {
        for (var j = 0; j < this.limit.length; j++) {
            result_percentage[j] = this.limit[j];
        }
    }


    return result_percentage;
};
// Get percentage, given limit
// if limit inferior to 0, return 0, never less
AdapType.prototype.getPercentage = function(value) {
    if (this.mode != "equal" && this.mode != "deform") {
        var result_percentage = new Array();
        result_percentage = this.limit;
    } else if (this.mode == "equal") {
        if (this.limit >= 1) {
            var result_percentage = 1;
        } else {
            var result_percentage = this.limit;
        }

    } else {
        var result_percentage = this.limit;
    }

    return result_percentage;

};

AdapType.prototype.reRandom = function() {
    if (this.mode != "random") {
        this.mode = "random";
    }
    this.percentage = 0;
    this.limit = 0;
    this.percentagaPerLetter = [];
    this.getLimit();
    this.interpolate();
};

AdapType.prototype.changeMode = function(mode) {
    if (mode == "firstLetter" || mode == "equal" || mode == "random" || mode == "firstLetter" ||
        mode == "lastLetter" || mode == "middleLetter" || mode == "chosenLetter" || mode == "deform") {
        this.mode = mode;
    this.percentage = 0;
    this.limit = 0;
    this.percentagaPerLetter = [];
    this.getLimit();
    this.interpolate();
}
};

AdapType.prototype.getMode = function(mode) {
    return this.mode;
};

AdapType.prototype.changeText = function(text) {
    this.textToRender = text;
    this.percentage = 0;
    this.limit = 0;
    this.percentagaPerLetter = [];


    if (this.start == "min") {
        this.setWithMin();
    }

    this.getLimit();

    this.interpolate();

};
AdapType.prototype.getText = function(text) {
    return this.textToRender;

};

AdapType.prototype.changeStrokeColor = function(color) {
    this.stroke = color;
    this.interpolate();

};
/*
AdapType.prototype.changeToFont = function(f) {
    // 2 - 1 =  1
    // 2 - 2  = 0  0 1
    var size = this.fontSize;
    var text = this.textToRender;


    var selected = (this.fonts.length - f) * 2;
    if (this.selected_font != f) {
        this.selected_font = f;
        this.font1 = this.fonts_info[selected];
        this.font2 = this.fonts_info[selected + 1];
        if (this.mode == "random") {
            this.percentage = 0;
            this.limit = 0;
            this.percentagaPerLetter = [];

        }
        //check font size stays the same
        this.getLimit();
        this.interpolate();
    }



};
*/
AdapType.prototype.getStrokeColor = function() {
    return this.stroke;

};
AdapType.prototype.changeStrokeWidth = function(size) {
    this.strokeWidth = size;
    this.interpolate();

};
AdapType.prototype.getStrokeWidth = function() {
    return this.strokeWidth;

};
AdapType.prototype.getExponential = function() {
    return this.exponential;

};
AdapType.prototype.changeColor = function(color) {
    this.color = color;
    this.interpolate();

};

AdapType.prototype.changeExponential = function(exp) {
    this.exponential = exp;
    this.interpolate();

};

AdapType.prototype.getColor = function(color) {
    return this.color;

};

//change letters selected in mode chosen letters
AdapType.prototype.changeLettersSelect = function(l) {
    var letters = JSON.parse(l);
    this.chosenLetters = [];

    for (var i = 0; i < letters.length; i++) {
        if (letters[i] <= this.textToRender.length) {
            this.chosenLetters.push(letters[i]);
        }
    }
    this.percentage = 0;
    this.limit = 0;
    this.percentagaPerLetter = [];

    this.getLimit();
    this.interpolate();
};

// Calculate limit (percentage of each master),acording to the max container width.
// If the mode is deform, the limit indicates the percentage o width each letter fills.
AdapType.prototype.getLimit = function() {
    var f1 = this.font1;
    var margin = 0;
    var error_margin = this.fontSize / 10;
    var max_container = this.canvas.offsetWidth;
    var min_width = f1.checkWords(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

    //console.log("----");
    //console.log(this.textToRender);

    if (this.mode == "deform") {
        var totalincrease = (max_container - margin) - min_width - error_margin;
        var findlimit = (max_container) / min_width;
        this.limit = findlimit;

    } else {
        var f2 = this.font2;
        var max_width = f2.checkWords(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);

        var findlimit;
        var m = max_width - min_width;
        var min_letters = f1.checkWordsLetter(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
        var max_letters = f2.checkWordsLetter(this.textToRender, 0, this.boxHeight, this.fontSize, this.options);
        var glyphs = this.font1.stringToGlyphs(this.textToRender);

        var sum_min_letters=0;
        for (var i=0 ; i< min_letters.length ; i++){
            sum_min_letters+= min_letters[i];

        }
        //console.log("sum  "+ sum_min_letters);
        //console.log("all  "+ min_width);
        //console.log("mode  "+ this.mode);

        if (this.mode != "equal") {
            max_container -= margin;
            var max_container2 = max_container;
            if (this.textToRender.indexOf(' ') >= 0) {
                for (var k = 0; k < min_letters.length; k++) {
                    if (glyphs[k].name == "space") {
                        max_container2 -= min_letters[k];

                    }

                }
            }

            var totalincrease = max_container - min_width;
            if (this.percentage == 0) {
                var limit = [];
                var variable_random = 1 - (min_letters.length / 100) * 1.5;
                if (totalincrease > 0) {
                    var n = totalincrease;
                    var delta = totalincrease - min_width;

                    var size = [];
                    limit = [];
                    for (var p = 0; p < min_letters.length; p++) {
                        var m2 = max_letters[p] - min_letters[p];

                        //if both letters have the same width
                        if (m2 == 0) {
                            var letter_width = (min_letters[p]);
                            var percentage_overall = letter_width / max_container;
                            var letter_limit = 0;

                            this.percentagaPerLetter.push(percentage_overall);


                        } else {
                            if (this.mode == "random") {
                                if (p == min_letters.length - 1) {
                                    var s = n;
                                } else {
                                    if (glyphs[p].name == "space") {
                                        var s = 0;
                                    } else {
                                        var s = Math.round(Math.random() * n / min_letters.length * 2.5);
                                        if (s > max_letters[p]) {
                                            s = max_letters[p];
                                        }
                                    }
                                }
                                var letter_width = (s + min_letters[p]);
                                size.push(letter_width);
                                n -= s;

                                var letter_limit = this.getLimit_byWidth(letter_width, min_letters[p], m2);


                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "firstLetter") {
                                if (p == 0) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }
                                size.push(letter_width);


                                var letter_limit = this.getLimit_byWidth(letter_width, min_letters[p], m2);
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);


                            } else if (this.mode == "lastLetter") {
                                if (p == min_letters.length - 1) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }
                                size.push(letter_width);


                                var letter_limit = this.getLimit_byWidth(letter_width, min_letters[p], m2);
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "middleLetter") {
                                var middle = parseInt(min_letters.length / 2);
                                if (p == middle) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }
                                size.push(letter_width);


                                var letter_limit = this.getLimit_byWidth(letter_width, min_letters[p], m2);
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "chosenLetter") {
                                var num_letters = this.chosenLetters.length;
                                var increase_per_letter = n / num_letters;
                                var letter_width = 0;
                                for (var k = 0; k < this.chosenLetters.length; k++) {
                                    if (p + 1 == this.chosenLetters[k]) {
                                        var letter_width = (increase_per_letter + min_letters[p]);
                                        break;
                                    } else {
                                        var letter_width = (min_letters[p]);

                                    }
                                }


                                var letter_limit = this.getLimit_byWidth(letter_width, min_letters[p], m2);
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            }

                        }
                        limit.push(letter_limit);
                    } //fechas for

                } else {
                    var font = this.fontSize;

                    var newfont = max_container / min_width * font;
                    this.fontSize = newfont;
                    this.height = newfont * this.lineHeight;
                    this.boxHeight = newfont;

                    $("#" + this.canvasID).attr("height", this.height);

                    var max_width = f2.checkWords(this.textToRender, 0, this.boxHeight, newfont, this.options);

                    var min_letters = f1.checkWordsLetter(this.textToRender, 0, this.boxHeight, newfont, this.options);
                    var max_letters = f2.checkWordsLetter(this.textToRender, 0, this.boxHeight, newfont, this.options);
                    var glyphs = this.font1.stringToGlyphs(this.textToRender);

                    for (var p = 0; p < min_letters.length; p++) {
                        var m2 = max_letters[p] - min_letters[p];
                        var n = max_container - min_width;

                        // se masters forem igual
                        if (m2 == 0) {
                            letter_limit = 0;
                            var letter_width = (min_letters[p]);
                            var percentage_overall = letter_width / max_container;
                            var letter_limit = 0;

                            this.percentagaPerLetter.push(percentage_overall);

                        } else {
                            if (this.mode == "random") {
                                var variable_random = 1 - (min_letters.length / 100) * 1.5;

                                if (p == min_letters.length - 1) {
                                    var s = n;
                                } else {
                                    if (glyphs[p].name == "space") {
                                        var s = 0;
                                    } else {
                                        var s = Math.round(Math.random() * n * variable_random);
                                        if (s > max_letters[p]) {
                                            s = max_letters[p];
                                        }
                                    }
                                }
                                n -= s;

                                var letter_width = (s + min_letters[p]);

                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "firstLetter") {
                                if (p == 0) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }

                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);


                            } else if (this.mode == "lastLetter") {
                                if (p == min_letters.length - 1) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "middleLetter") {
                                var middle = parseInt(min_letters.length / 2);
                                if (p == middle) {
                                    var letter_width = (n + min_letters[p]);

                                } else {
                                    var letter_width = (min_letters[p]);

                                }
                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            } else if (this.mode == "chosenLetter") {
                                var num_letters = this.chosenLetters.length;
                                var increase_per_letter = n / num_letters;
                                var letter_width = 0;
                                for (var k = 0; k < this.chosenLetters.length; k++) {
                                    if (p + 1 == this.chosenLetters[k]) {
                                        var letter_width = (increase_per_letter + min_letters[p]);
                                        break;
                                    } else {
                                        var letter_width = (min_letters[p]);

                                    }
                                }

                                var percentage_overall = letter_width / max_container;
                                this.percentagaPerLetter.push(percentage_overall);

                            }

                        }
                        limit.push(0);
                    }



                } //close if total increase
                this.limit = limit;
                // if not 1ª time runing, for trigger event (example: windowResized()) percentage is already defined
            } else {

                //console.log("------------------------------")
                //console.log("------------------------------")
                var last_width_array = this.getAllGlyphWidth(this.limit, min_letters, max_letters);
                var new_max = this.canvas.offsetWidth;


                var max_width = this.getSumGlyphsWithoutMargin(max_letters);
                var lastwidth = this.getSumGlyphsWithoutMargin(last_width_array);


                var glyph = this.font1.stringToGlyphs(this.textToRender);

                var max_container_space = max_container;
                var width_spaces = 0;
                var width_total = 0;
                var width_allletters = 0;

                if (this.textToRender.indexOf(' ') >= 0) {
                    for (var k = 0; k < min_letters.length; k++) {
                        var m = max_letters[k] - min_letters[k];
                        if (glyph[k].name == "space") {
                            max_container_space -= min_letters[k];
                            width_spaces += min_letters[k];
                            width_total += width_spaces;
                        } else {
                            width_total += this.getWith_byLimit(min_letters[k], this.limit[k], m);

                        }

                    }
                }
                var max_space = new_max - width_spaces;
                if (this.textToRender.indexOf(' ') >= 0) {
                    var percentage_allletters = 0;
                    for (var k = 0; k < min_letters.length; k++) {
                        var m = max_letters[k] - min_letters[k];
                        if (glyph[k].name != "space") {
                            percentage_allletters += this.percentagaPerLetter[k];
                            var percentage_i = this.percentagaPerLetter[k];
                            this.percentagaPerLetter[k] = max_space * percentage_i / max_container_space;
                        }

                    }
                }
                var widthOverload = this.widthOverload(new_max, min_letters, max_letters);


                //console.log("width_spaces   "+width_spaces);
                //console.log("width_total   "+width_total);
                //console.log("max_container_space   "+max_container_space);
                //console.log("container_max         "+new_max);
                //console.log("percentage_allletters   "+percentage_allletters);
                //console.log("...........   ");
                //console.log("min_width   "+min_width);
                //console.log("new_max   "+new_max);

                var allletters_width = 0;
                if (min_width < new_max) {


                    for (var h = 0; h < this.limit.length; h++) {
                        var m = max_letters[h] - min_letters[h];
                        var max_overload = 0;
                        var limit = 0;
                        var letter_width = 0;

                        var width = this.getWith_byLimit(min_letters[h], this.limit[h], m);
                        var min_width_letter = min_letters[h];
                        if (glyph[h].name != "space") {
                            var width_new = new_max * this.percentagaPerLetter[h];
                        } else {
                            var width_new = min_width_letter;
                        }


                        var max_overload = width_new - min_width_letter;

                        if (widthOverload > 0) {
                            if (min_width_letter <= width_new && glyph[h].name != "space") {
                                if (widthOverload > max_overload) {
                                    letter_width = min_width_letter;
                                    widthOverload -= max_overload;
                                } else {
                                    if (glyph[h].name != "space") {
                                        letter_width = width_new - widthOverload;
                                        widthOverload = 0;
                                    } else {
                                        letter_width = min_width_letter;

                                    }
                                }


                            } else {
                                letter_width = min_width_letter;
                            }
                        } else {

                            if (min_width_letter < width_new && glyph[h].name != "space") {
                                letter_width = width_new;
                            } else {
                                letter_width = min_width_letter;
                            }

                        }
                        if (glyph[h].name != "space") {
                            limit = this.getLimit_byWidth(letter_width, min_letters[h], m);

                        } else {
                            limit = 0;

                        }
                        //console.log("letter_width       "+letter_width);
                        //console.log("min_width_letter   "+min_width_letter);
                        //console.log("max_overload       "+max_overload);
                        //console.log("widthOverload      "+widthOverload);

                        this.limit[h] = limit;
                        allletters_width += letter_width;


                    }
                    //console.log("allletters_width     "+allletters_width);
                    //console.log("------------------------------")
                } else {
                    //if word in its minimum doesnt fit screen, decrease fontSize.
                    for (var h = 0; h < this.limit.length; h++) {
                        limit = 0;
                        this.limit[h] = limit;
                        letter_width = min_letters[h];
                        allletters_width += letter_width;

                    }

                    var font = this.fontSize;
                    var newfont = (new_max / min_width) * font;
                    this.fontSize = newfont;
                    this.height = newfont * this.lineHeight;
                    this.boxHeight = newfont;

                    $("#" + this.canvasID).attr("height", this.height);
                }

            }

        } else {
            //equal mode
            var container_margin = this.getGlyphsWithoutMarginArraySum(max_container);
            var dif = Math.abs(min_width - max_container);
            if (max_width > max_container && min_width < max_container) {
                findlimit = this.getLimit_byWidth(max_container, min_width, m);
            } else if (dif >= 1) {
                // console.log(min_width );
                // console.log(max_container );
                findlimit = 0;
                var font = this.fontSize;
                var min = min_width;
                var newfont = (max_container / min_width) * font;
                this.fontSize = newfont;
                this.boxHeight = newfont;

                this.height = newfont * this.lineHeight;
                $("#" + this.canvasID).attr("height", this.height);

            } else {
                findlimit = 1;
            }
            this.limit = findlimit;
        }
    }


};

//calculation, for given Width get Limit
AdapType.prototype.getLimit_byWidth = function(width, min_width, m) {
    var result = (width - min_width) / m;
    return result;

};
//calculation, for given Limit get Width
AdapType.prototype.getWith_byLimit = function(min_width, limit, m) {
    var result = (m * limit) + min_width;
    return result;

};

//Get array width all glyphs width, given limit
AdapType.prototype.getAllGlyphWidth = function(array_limit, array_minwidth, array_maxwidth) {
    var group_limits = array_limit;
    var group_min = array_minwidth;
    var group_max = array_maxwidth;
    var total = new Array();
    for (var i = 0; i < group_limits.length; i++) {
        var m = group_max[i] - group_min[i];
        var glyph_width = this.getWith_byLimit(array_minwidth[i], group_limits[i], m);
        total[i] = glyph_width;
    }
    return total;


};
//Get sum of all glyphs widths, with its margins.
AdapType.prototype.getSumGlyphsWithMargin = function(array_min) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);

    var min = array_min;
    var total = 0;
    var metrics_rightSideBearing = 0;
    var metrics_leftSideBearing = 0;
    var convert_rightSideBearing = 0;
    var convert_leftSideBearing = 0;
    for (var i = 0; i < array_min.length; i++) {
        metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
        convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);

        total += min[i] + convert_rightSideBearing + convert_leftSideBearing;
        metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
        convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);
    }
    return total;


};

//Get sum of all glyphs widths, with its margins.
AdapType.prototype.getSumGlyphsWithoutMargin = function(array_min) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);

    var min = array_min;
    var total = 0;
    for (var i = 0; i < array_min.length; i++) {
        total += min[i];
    }
    return total;


};

//Get array width all glyphs widths, with its margins.
AdapType.prototype.getSumGlyphsWithMarginArray = function(array_min) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    var min = array_min;
    var total = new Array();
    var metrics_rightSideBearing = 0;
    var metrics_leftSideBearing = 0;
    var convert_rightSideBearing = 0;
    var convert_leftSideBearing = 0;
    for (var i = 0; i < array_min.length; i++) {
        metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
        convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);


        total[i] = min[i] + convert_rightSideBearing + convert_leftSideBearing;
        metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
        convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);
    }
    return total;


};

//Get array width all glyphs widths, removing its margins.
AdapType.prototype.getGlyphsWithoutMarginArray = function(array_min) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    var min = array_min;
    var total = new Array();
    var metrics_rightSideBearing = 0;
    var metrics_leftSideBearing = 0;
    var convert_rightSideBearing = 0;
    var convert_leftSideBearing = 0;
    for (var i = 0; i < array_min.length; i++) {
        metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
        convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);
        metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
        convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);

        total[i] = min[i] - convert_rightSideBearing - convert_leftSideBearing;

    }
    return total;


};
//Get sum of all glyphs widths, removing its margins.
AdapType.prototype.getGlyphsWithoutMarginArraySum = function(array_min) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    var total = array_min;
    var metrics_rightSideBearing = 0;
    var metrics_leftSideBearing = 0;
    var convert_rightSideBearing = 0;
    var convert_leftSideBearing = 0;
    for (var i = 0; i < glyphs.length; i++) {
        metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
        convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);
        metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
        convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);

        total += -convert_rightSideBearing - convert_leftSideBearing;

    }
    return total;


};

//Get specific glyphs width, with its margins.
AdapType.prototype.getGlyphWithMargin = function(width, x) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    var i = parseInt(x);
    var total = 0;
    var metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
    var convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);

    var metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
    var convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);


    total = width + convert_rightSideBearing + convert_leftSideBearing;


    return total;


};
//Get specific glyphs width, removing its margins.
AdapType.prototype.getGlyphWith_withoutMargin = function(width, i) {
    var glyphs = this.font1.stringToGlyphs(this.textToRender);
    var total = 0;
    var metrics_rightSideBearing = glyphs[i].getMetrics().rightSideBearing;
    var convert_rightSideBearing = this.convertMeasure(metrics_rightSideBearing);


    var metrics_leftSideBearing = glyphs[i].getMetrics().leftSideBearing;
    var convert_leftSideBearing = this.convertMeasure(metrics_leftSideBearing);


    total = width - convert_rightSideBearing - convert_leftSideBearing;


    return total;


};
//Convert any measure from font file, to size when drawing on canvas.
AdapType.prototype.convertMeasure = function(measure) {
    var unitsPerEm = this.options.unitsPerEm || 1000;
    var scale = 1 / unitsPerEm * this.fontSize;
    var newmeasure = measure * scale;
    return newmeasure;

}

//Calculation needed when window resized on mode random, firstlettes,etc. 
//When some letter letters reach its limit, other need to compensate so the word will always fit the size of container.
AdapType.prototype.widthOverload = function(container_w, min_l, max_l) {
    var container_width = container_w;
    var min_letters = min_l;
    var max_letters = max_l;
    var glyphs = this.font1.stringToGlyphs(this.textToRender);

    var widthOverload = 0;
    for (var i = 0; i < this.limit.length; i++) {
        var percentage = this.percentagaPerLetter[i];
        var min_width = min_letters[i];

        if (glyphs[i].name != "space") {
            var new_width = container_w * percentage;
        } else {
            var new_width = min_width;
        }


        if (new_width <= min_width) {
            widthOverload += (min_width - new_width);
        }

    }
    return widthOverload;

}
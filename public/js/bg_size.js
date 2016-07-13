// roundnth() - Round a number to the nth place.
// @param float num the number to round
// @param int places the number of decimal places to include
function roundnth(num, places) {
  var base = Math.pow(10,places),
      parsed = parseFloat(num),
      unit = "", result = "";
  if (num != parsed) { // a unit is included in num, so strip b4 calc
    unit = (num + "").replace((parsed + ""),"");
  }
  result = Math.round(parsed * (base)) / base;
  if (unit) result += unit;
  return result;
}

// getBgImgDims() - Get the dimensions of the element's background-image 
// @param jquery element the jquery element whose background we're seeking
// @return object an obj in the form {w: width, h: height} in pixels.
function getBgImgDims(element) {
  var image_url = element.css('background-image').match(/^url\("?(.+?)"?\)$/) , image_dims = {w: 0, h: 0};
  if (image_url[1]) {
    image_url = image_url[1];
    var image = new Image();
    $(image).load(function(){
      image_dims.w = image.width;
      image_dims.h = image.height;
    });
    image.src = image_url;
  }
  return image_dims;
}

// applyBgSizeCSS() - Apply background-size CSS value to jQuery element
// @param string value the value for the background-size CSS property
// @param jquery element a jquery object representing the element which we're applying the CSS to.
// @return jquery a jquery object representing the element, after the CSS has been applied.
function applyBgSizeCSS(value, element, isCalculated) {
  if ("undefined"==typeof element) element = $(".bgc");
  if (value == "" || value == "(empty)" || value == "(not set)") {
    console.log("resetting CSS to initial state...");
  } else {
    if ("undefined"!=typeof isCalculated && isCalculated == true) {
      console.log("applying calculated CSS (" + value + ")...");
    } else {
      console.log("applying static CSS (" + value + ")...");
    }
  }
  return element.css({'background-size':value});
}

// calculateBgSize() - Calculate the background-size CSS value for a jQuery element
// @param string value the value for the background-size CSS property
// @param jquery element a jquery object representing the element which we're modifying
// @return jquery a jquery object representing the element, after it has been modified.
function calculateBgSize(value, element, options) {
  var unit = "%"; if ("object"==typeof options) {
    if ("undefined"!=typeof options.to) {
      unit = (options.to == "percent" ? "%" : options.to);
    }
  }
  var calc = 0; if ("undefined"==typeof element) element = $(".bgc");

  /* DO SOME MATH! */
  // When the image is stretched to fill 100% container width ...
  wr = c.w / m.w; // c is wr times wider than m (wr = width ratio)
  xh = m.h * wr;  // the height of m when the wr is applied (xh = calculated height)
  dh = c.h - xh;  // positive = contain, negative or 0 = cover
  // When the image is stretched to fill 100% container height ...
  hr = c.h / m.h; // c is hr times taller than m (hr = height ratio)[
  xw = m.w * hr;  // the width of m when the hr is applied (xw = calculated width)
  dw = c.w - xw;  // positive = contain, negative or 0 = cover;

  console.log(dh, dw, value);

  // Handle various background-size keywords and values
  switch(value) {
    case "contain":
      if (dh > 0 && calc == 0) {
        // container height is bigger when image is full width, satisfying 'contain'
        calc = "100%"; // bgsize:100% will stretch image to full width of the container, leaving whitespace around height.
      }
      if (dw > 0 && calc == 0) {
        // container width is bigger when image is full height, satisfying 'contain'
        // determine the width percentage that forces image height to match its container
        calc = ((xw / c.w) * 100) + "%"; // bgsize:(calc)% will stretch image to full height of container, leaving whitespace around width.
      }
      break;
    case "cover":
      if (dh <= 0 && calc == 0) {
        // image height is larger when image is full width, satisfying 'cover'
        calc = "100%"; // background-size:100% will stretch image to full width with excessive height.
      }
      if (dw <= 0 && calc == 0) {
        // image width is larger when image is full height, satisfying 'cover'
        // determine the width percentage that forces image height to match its container
        calc = ((xw / c.w) * 100) + "%"; // bgsize:(calc)% will stretch image to full height with excessive width.
      }
      break;
    case "auto": case "auto auto":
      // The default size. No stretching included.
      calc = ((m.w / c.w) * 100) + "%";
      break;
    default:
      if (value.indexOf('=')>=1 || value.indexOf(' ')>=1) {
        // 2COMPLEX4U, skip for now...
      } else if (value.indexOf('-')>=0) {
        // We don't care about negative values right now, only positive ones...
      } else {
        // This is a single positive value with units [vw,vh,px]
        if (value.indexOf('vw') >= 1) { // 10vw = 10% of $w.w
          // Image width scales with the window width.
          // CAVEAT: Converting this to a percentage of the container means that it must be recalculated on every horizontal resize.
          // @TODO: Add option to allow a resize handler to be set.
          calc = $(window).width() * (parseFloat(value) / 100); // new pixel width of image
          calc = ((calc / c.w) * 100) + "%"; // as a percentage of its container.
          break;
        } else if (value.indexOf('vh') >= 1) { // 10vh = 10% of $w.h
          // Image width scales with the window height.
          // CAVEAT: Converting this to a percentage of the container means that it must be recalculated on every vertical resize.
          // @TODO: Add option to allow a resize handler to be set.
          calc = $(window).height() * (parseFloat(value) / 100); // new pixel width of image
          calc = ((calc / c.w) * 100) + "%"; // as a percentage of its container.
          break;
        } else if (value.indexOf('px') >= 1) { 
          calc = ((parseFloat(value) / c.w) * 100) + "%"; // as a percentage of its container.
          break;
        }

      }
      

      // For now just push it through...
      console.log("Instead of cover or contain, we got passed: ", value);
      calc = value;
      break;
  }

  // Check the units before we finish.
  if (unit=="px") {
    // We need to convert the percentage values to pixel values.
    // We know that 100% of container = 1 * c.w
    calc = (parseFloat(calc) / 100 * c.w) + "px";
    calc = roundnth(calc, 4);
  } else if (unit=="%") {
    /* goggles */
  }

  return applyBgSizeCSS(calc, element, 1);
}
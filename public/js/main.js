// Define our background container, its dimensions, and the background-image dimensions.
var bo,                                   // background-size original value
    bgsCamel = "backgroundSize",
    bgsDash = "background-size",
    $c = $(".bgc"),                       // background container
    c = {w: $c.width(), h: $c.height() }, // Container dimensions
    m = getBgImgDims($c);                 // iMage dimensions 

$(function(){

  // Save the initial value for the background-size, and display its result:
  bo = $c.css('background-size');
  if (bo == "") bo = "(not set)";
  $("#bgsize_orig").val(bo);

  // Set up handler for changing the container's css
  $c.on('css_change',function(e){ 
    var value = ""; //for (var i=0; i<e.args.length; i++) { console.log(typeof e.args[i], e.args[i]); } /* DEBUG: Print out arguments. */
    if ("object"== typeof e.args[0]) { // argument uses object notation: .css({'property':'value'})
      var props = Object.keys(e.args[0]); // @TODO: Loop through the args until we find the one we care about.
      if (props.length == 1 && ( props[props.length-1] == bgsDash || props[props.length-1] == bgsCamel )) {
        value = e.args[0][props[props.length-1]];
      }
    } else if ("string"== typeof e.args[0]) { // argument uses string notation: .css("property") or .css("property", "value")
      if ("undefined"!= typeof e.args[0]) { value = e.args[1]; } else { return /* goggles */; } 
    }
    if (value != "") { $("#bgsize_curr").val(value); } else { $("#bgsize_curr").val("(empty)"); } // Report the new value.
  });

  // Set up handlers for buttons.
  $("#css_cover").click(function(){   applyBgSizeCSS("cover",  $c); });
  $("#css_contain").click(function(){ applyBgSizeCSS("contain",$c); });
  $(".button-group[data-action=calculate] button").click(function(){
    var $this = $(this), unit = "", val = $this.data('value'),
        to_unit = $this.parent('.button-group').data("units");
    switch($this.data('unit')) {
      case "keyword":                       // no units for keywords
        if (val == 'original') val = bo;      // original uses var bo
        break;
      case "percent": unit = "%";           // use percent sign as unit 
      default: unit=(unit?unit:$this.data('unit')); // use data as unit
        val += unit;                        // append unit to value
    } console.log(val + ' to ' + to_unit);
    // Call the method!
    calculateBgSize( val, $c, {to:to_unit} );
  });
  $("#css_convert").click(function(){ calculateBgSize( bo ,    $c); });
  $("#css_clear").click(function(){   applyBgSizeCSS("",       $c); });
  $("#css_reset").click(function(){    applyBgSizeCSS( bo ,    $c); });

});

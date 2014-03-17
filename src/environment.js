// set up debug logging for the current JS environment/engine
// browser also logs to <div id="output"> if jquery is detected
// the various debug tracing options use h$log
var h$glbl;
function h$getGlbl() { h$glbl = this; }
h$getGlbl();
#ifdef GHCJS_LOG_BUFFER
var h$logBufferSize = 6000;
var h$logBufferShrink = 1000;
var h$logBuffer = [];
#endif
function h$log() {
#ifdef GHCJS_LOG_BUFFER
  var s = '';
  for(var i=0;i<arguments.length;i++) { s = s + arguments[i]; }
  h$logBuffer.push(s);
  if(h$logBuffer.length > h$logBufferSize) h$logBuffer = h$logBuffer.slice(h$logBufferShrink);
#else
  if(h$glbl) {
    if(h$glbl.console && h$glbl.console.log) {
      h$glbl.console.log.apply(h$glbl.console,arguments);
    } else {
      h$glbl.print.apply(this,arguments);
    }
  } else {
    print.apply(this, arguments);
  }
#endif
  // if we have jquery, add to <div id='output'> element
  if(typeof(jQuery) !== 'undefined') {
    var x = '';
    for(var i=0;i<arguments.length;i++) { x = x + arguments[i]; }
    var xd = jQuery("<div></div>");
    xd.text(x);
    jQuery('#output').append(xd);
  }
}

function h$collectProps(o) {
  var props = [];
  for(var p in o) { props.push(p); }
  return("{"+props.join(",")+"}");
}



// load the command line arguments in h$programArgs
// the first element is the program name
var h$programArgs;
if(typeof scriptArgs !== 'undefined') {
  h$programArgs = scriptArgs.slice(0);
  h$programArgs.unshift("a.js");
} else if(typeof process !== 'undefined' && process.argv) {
  h$programArgs = process.argv.slice(1);
} else if(typeof arguments !== 'undefined') {
  h$programArgs = arguments.slice(0);
  h$programArgs.unshift("a.js");
} else {
  h$programArgs = [ "a.js" ];
}

function h$getProgArgv(argc_v,argc_off,argv_v,argv_off) {
  var c = h$programArgs.length;
  if(c === 0) {
    argc_v.dv.setInt32(argc_off, 0, true);
  } else {
    argc_v.dv.setInt32(argc_off, c, true);
    var argv = h$newByteArray(4*c);
    argv.arr = [];
    for(var i=0;i<h$programArgs.length;i++) {
      argv.arr[4*i] = [ h$encodeUtf8(h$programArgs[i]), 0 ];
    }
    if(!argv_v.arr) { argv_v.arr = []; }
    argv_v.arr[argv_off] = [argv, 0];
  }
}

function h$getpid() {
  if(this['process']) return process.id;
  return 0;
}

function h$__hscore_environ() {
  h$ret1 = 0;
  return null;
}

function h$getenv() {
  h$ret1 = 0;
  return null;
}

function h$errorBelch() {
  h$log("### errorBelch: do we need to handle a vararg function here?");
}

function h$errorBelch2(buf1, buf_offset1, buf2, buf_offset2) {
//  log("### errorBelch2");
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}

function h$debugBelch2(buf1, buf_offset1, buf2, buf_offset2) {
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}

function h$errorMsg(pat) {
  // poor man's vprintf
  var str = pat;
  for(var i=1;i<arguments.length;i++) {
    str = str.replace(/%s/, arguments[i]);
  }
  if(typeof process !== 'undefined' && process && process.stderr) {
    process.stderr.write(str);
  } else if (typeof printErr !== 'undefined') {
    printErr(str);
  } else if (typeof putstr !== 'undefined') {
    putstr(str);
  } else if(typeof(console) !== 'undefined') {
    console.log(str);
  }
}

function h$performMajorGC() {
  // save current thread state so we can enter the GC
  var t = h$currentThread;
  h$sp += 2;
  h$stack[h$sp]   = h$return;
  h$stack[h$sp-1] = h$r1;
  t.sp = h$sp;
  h$currentThread = null;

  h$gc(t);

  // restore thread state
  h$currentThread = t;
  h$stack = t.stack;
  h$r1 = h$stack[t.sp-1];
  h$sp = t.sp-2;
}


function h$baseZCSystemziCPUTimeZCgetrusage() {
  return 0;
}

function h$getrusage() {
  return 0;
}


// fixme need to fix these struct locations

function h$gettimeofday(tv_v,tv_o,tz_v,tz_o) {
  var now = Date.now();
  tv_v.dv.setInt32(tv_o,     (now / 1000)|0, true);
  tv_v.dv.setInt32(tv_o + 4, ((now % 1000) * 1000)|0, true);
  if(tv_v.len >= tv_o + 12) {
    tv_v.dv.setInt32(tv_o + 8, ((now % 1000) * 1000)|0, true);
  }
  return 0;
}

function h$traceEvent(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}

function h$traceMarker(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}

var h$__hscore_gettimeofday = h$gettimeofday;

var h$myTimeZone = h$encodeUtf8("UTC");
function h$localtime_r(timep_v, timep_o, result_v, result_o) {
  var t = timep_v.i3[timep_o];
  var d = new Date(t * 1000);
  result_v.dv.setInt32(result_o     , d.getSeconds(), true);
  result_v.dv.setInt32(result_o + 4 , d.getMinutes(), true);
  result_v.dv.setInt32(result_o + 8 , d.getHours(), true);
  result_v.dv.setInt32(result_o + 12, d.getDate(), true);
  result_v.dv.setInt32(result_o + 16, d.getMonth(), true);
  result_v.dv.setInt32(result_o + 20, d.getFullYear()-1900, true);
  result_v.dv.setInt32(result_o + 24, d.getDay(), true);
  result_v.dv.setInt32(result_o + 28, 0, true); // fixme yday 1-365 (366?)
  result_v.dv.setInt32(result_o + 32, -1, true); // dst information unknown
  result_v.dv.setInt32(result_o + 40, 0, true); // gmtoff?
  if(!result_v.arr) result_v.arr = [];
  result_v.arr[result_o + 40] = [h$myTimeZone, 0];
  result_v.arr[result_o + 48] = [h$myTimeZone, 0];
  h$ret1 = result_o;
  return result_v;
}
var h$__hscore_localtime_r = h$localtime_r;

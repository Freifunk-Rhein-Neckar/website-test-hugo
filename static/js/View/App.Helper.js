// +---------------------------------------------------------------------------
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung:
// +  KorrektorIn:  
// +  Status: !validiert 2014/02/02  www.jslint.com (-)
// +  Revision: 2014/02/06 - Details am Ende der Datei
// +---------------------------------------------------------------------------
//
var app = app || {};
app.Helper = function ($) {
  //
  //
  //
  // +-------------------------------------------------------------------------
  // + Milliseconds to Nice Time Object.
  // + returns Object
  // +-------------------------------------------------------------------------
  var time = function (ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s  = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    h = h % 24;
    return {
      seconds: s,
      minutes: m,
      hours: h,
      toString: function (){
        function addTime(val){
          if (val < 10){
            return "0" + val;
          } else{
            return val;
          }
        };
        return addTime(this.hours) + ":" + addTime(this.minutes) + ":" + addTime(this.seconds);
      }
    };
  };
  var getParameter =  function (paramName) {
    var searchString = window.location.search.substring(1),
      i, val, params = searchString.split("&");

    for (i=0;i<params.length;i++) {
      val = params[i].split("=");
      if (val[0] == paramName) {
        return val[1];
      }
    }
    return null;
  };
  var init = function () { };
  //
  // +-------------------------------------------------------------------------
  // + Propagate the Public funtions
  // +-------------------------------------------------------------------------
  var public = {
    init: init,
	  time: time,
    getParameter: getParameter
  };
  
  return public;
}
//
// +---------------------------------------------------------------------------
// +  Liste der Aenderungen
// +  Datenelement       Datum        AutorIn            Beschreibung
// +---------------------------------------------------------------------------
// +  Modul              2014/02/06   lb                 erste Version 
//
//  Ende der Datei
//
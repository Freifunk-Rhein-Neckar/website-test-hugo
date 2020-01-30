// +---------------------------------------------------------------------------
// +  Datei: js/app.js    UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Application logic, for the onsite Skript.
// +  KorrektorIn:
// +  Status:
// +  Revision: 2018-05-17
// +---------------------------------------------------------------------------
'use strict'

// + Set Image Path for Leaflet:
L.Icon.Default.imagePath = "images/";

// + Set up the Namespace for Freifunk.
var app = {};
// + Set up the "global" data store for the app
app.data = {};

// + These two vars store the current user and node count. Updated every 15s.
app.data.onlineUserCount = 0;
app.data.onlineNodeCount = 0;
app.data.offlineNodeCount = 0;
app.data.nodesTotal = 0;
app.data.nodesWithGeo = 0;
app.data.map = null;
app.data.retrievedFromJson = {};

// +---------------------------------------------------------------------------
// + Register Events (behavior)
// +---------------------------------------------------------------------------
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  app.getCurrentStats();
  setInterval(function () {
    app.getCurrentStats();
  }, 60 * 1000);

  var options = {
    zoom: 10,
    center: [51.505, -0.09],
    scrollWheelZoom: false
  };

  app.data.map = app.View.Map(jQuery, "map");
  app.data.map.init(options);

});

$(document).on("usersupdated", function () {
    console.log("Online users: " + app.data.onlineUserCount);
    $('#users-online').text(app.data.onlineUserCount);
  })
  .on("geonodesupdated", function () {
    console.log("Online Nodes: " + app.data.onlineNodeCount);
    console.log("Nodes with GEO: " + app.data.nodesWithGeo);
    app.processNodes(app.data.map);

    $('#nodes-online').text(app.data.onlineNodeCount + " (" +
      app.getPercent(app.data.nodesTotal, app.data.onlineNodeCount)
        .toFixed(2).replace(".", ",") + "%)");
    $('#nodes-offline').text(app.data.offlineNodeCount + " (" +
      app.getPercent(app.data.nodesTotal, app.data.offlineNodeCount)
        .toFixed(2).replace(".", ",") + "%)");
    $('#nodes-with-geolocation').text(app.data.nodesWithGeo + " (" +
      app.getPercent(app.data.nodesTotal, app.data.nodesWithGeo)
        .toFixed(2).replace(".", ",") + "%)");
    $('#nodes-total').text(app.data.nodesTotal);


  })
  .on("nodesupdated", function () {
    $('#nodes-total').text(app.data.nodesTotal);
    console.log("Nodes: " + app.data.nodesTotal);
  });


// +---------------------------------------------------------------------------
// + Current Stats
// + Uses NGINX to proxy meshviewer.json to avoid the CORS problem.
// +
// + location = /meshviewer.json {
// +       proxy_pass https://map.ffrn.de/data/meshviewer.json;
// +    proxy_cache off;
// + }
// +
// + @fires: event on document: "usersupdated" Whenever the function completes
// + a successfull Ajax request.
// +---------------------------------------------------------------------------
app.getCurrentStats = function () {
  $.get("meshviewer.json", function (json) {
    // json should already be an object. If not, try to parse. 
    if (typeof json === "string") json = JSON.parse(json);
    if (!json || typeof json.nodes === "undefined"){
      // error parsing JSON
    } else {
      app.data.retrievedFromJson = json; 

      var date = new Date(app.data.retrievedFromJson.timestamp);
      var nodes = app.data.retrievedFromJson.nodes;
      var onlineNodes = nodes.filter(function (d) {
            return d.is_online;
          }).length,
          nNodes = nodes.filter(function (d) {
            return !d.is_gateway;
          }).length,
          nClients = nodes.reduce(function (previousValue, currentValue) {
            if (typeof(previousValue) !== "number") {
              previousValue = 0;
            }
            return previousValue + currentValue.clients;
          }),
          geoNodes = nodes.filter(function (d) {
            return d.location;
          }).length;

      // + When the pased data differs from the current: update the values
      // + and trigger the event.
      if (app.data.onlineNodeCount !== onlineNodes || app.data.nodesWithGeo !== geoNodes) {
        app.data.onlineNodeCount = onlineNodes;
        app.data.nodesWithGeo = geoNodes;
        app.data.offlineNodeCount = nNodes - onlineNodes;
        app.data.nodesTotal = nNodes;
        $(document).trigger("geonodesupdated");
      }
      if (app.data.onlineUserCount !== (nClients)) {
        app.data.onlineUserCount = nClients;
        $(document).trigger("usersupdated");
      }
      if (app.data.nodesTotal !== nNodes) {
        app.data.nodesTotal = nNodes;
        $(document).trigger("nodesupdated");
      }
    }
  });
};

app.getPercent = function (base, share) {
  if (base && share) {
    return (100 / base) * share;
  }
  else {
    return 0.0;
  }

};

app.processNodes = function (map) {
  if (map) {
    var data = app.data.retrievedFromJson;

    map.flushCluster();
    $.each(data.nodes, function (index, node) {
      var lat, long, online, name, category;
      // Get Data out of the node.
      if (node.location) {
        if (node.hostname) {
          name = node.hostname;
        }
        map.addClusterMarker(node.location.latitude, node.location.longitude, node.is_online, name, node.clients, node.lastseen);
      }
    });
    map.processView();
  }
};

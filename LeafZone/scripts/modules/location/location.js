(function (global) {
	var LocationService,
        LeafIcon,
        app = global.app = global.app || {};
    
    LeafIcon = L.Icon.extend({
        options: {
            iconSize: [37, 41],
    		iconAnchor:   [22, 94],
            shadowUrl: 'styles/images/leaf-shadow.png',
            shadowSize:   [0, 0],
    		shadowAnchor: [0, 0]
        }
    });

	LocationService = kendo.Class.extend({
        locationData: null,
        lat: 0,
        long: 0,
        
		init: function () {
			var that = this;

            that.class1 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-1.png', iconRetinaUrl: 'styles/images/map-pin-class-1@2x.png'});
            that.class2 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-2.png', iconRetinaUrl: 'styles/images/map-pin-class-2@2x.png'});
            that.class3 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-3.png', iconRetinaUrl: 'styles/images/map-pin-class-3@2x.png'});
            that.class4 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-4.png', iconRetinaUrl: 'styles/images/map-pin-class-4@2x.png'});
            that.class5 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-5.png', iconRetinaUrl: 'styles/images/map-pin-class-5@2x.png'});
            that.class6 = new LeafIcon({iconUrl: 'styles/images/map-pin-class-6.png', iconRetinaUrl: 'styles/images/map-pin-class-6@2x.png'});
            
            that.locationData = [];
			that.showModule = $.proxy(that.initData, that);
		},
        
        initData: function () {
            var that = this,
            	q = new Everlive.Query();
        
            app.common.showLoading();
            
            q.select("Location", "OzonePercent", "Id");
        
            return app.everlive.data("UserPlants").get(q)
            .then($.proxy(that.storeLocationData, that))
            .then($.proxy(that.getCurrentLocation, that))
            .then($.proxy(that.updateMarkers, that));
        },
        
        storeLocationData: function (data) {
            var currentItem;
            
            for (var i = 0; i < data.result.length; i++) {
                currentItem = data.result[i];
                this.locationData.push([currentItem.Location.latitude, currentItem.Location.longitude, currentItem.OzonePercent]);
            }
        },
        
        getCurrentLocation: function () {
            var that = this;
            
            return new RSVP.Promise(function (resolve, reject) {
                
                app.common.getCurrentLocation()
                .then(function (position) {
                    that.lat = position.coords.latitude;
            		that.long = position.coords.longitude;
                    resolve();
                }, function () {
                    that.lat = 42.68;
                    that.long = 23.33;
                    resolve();
                }); 
            });            
        },
        
        getMarkerClass: function (ozonePercent) {
            var that = this;
            
            if(ozonePercent > 75){
                return that.class6;
            } else if(ozonePercent > 50 && ozonePercent <= 75 ) {
                return that.class5;
            } else if(ozonePercent > 25 && ozonePercent <= 50 ) {
                return that.class4;
            } else if(ozonePercent > 6 && ozonePercent <= 25 ) {
                return that.class3;
            } else if(ozonePercent > 0 && ozonePercent <= 6 ) {
                return that.class2;
            } else {
                return that.class1;
            }            
        },

		updateMarkers: function () {
			var that = this,
                LeafIcon,
                tiles,
                map,
                marker,
                currentLocationItem,
                latlng = L.latLng(that.lat, that.long),
                markers = new L.MarkerClusterGroup();
			
            tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: ""
			});

			map = L.map("map", {center: latlng, zoom: 13, layers: [tiles]});
            that.addLegend(map);
            
            for (var i = 0; i < that.locationData.length; i++) {
                currentLocationItem =  that.locationData[i];
                
                marker = L.marker(
                    new L.LatLng(
                        currentLocationItem[0], 
                        currentLocationItem[1]), { 
                        title: currentLocationItem[2], 
                        icon: that.getMarkerClass(currentLocationItem[2]) 
                    });
                //marker.bindPopup(currentLocationItem[2]);
                markers.addLayer(marker);
            }
            
			map.addLayer(markers);
            
            app.common.hideLoading();
		},
        
        addLegend: function(map) {
            var legend = L.control({position: 'bottomright'});
            
            function getColor(d) {
                return d > 75 ? '#2c0506' :
                d > 50  ? '#612c30' :
                d > 25  ? '#c1272d' :
                d > 6  ? '#f36f21' :
                d > 1 ? '#ffc20e':
                	'#81c342';
            }
            
            legend.onAdd = function (map) {                
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 1, 6, 25, 50, 75],
                    labels = [];
                
                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }
                
                return div;
            };
            
            legend.addTo(map);
        }
	});

	app.locationService = new LocationService();
})(window);
(function (global) {
	var LocationService,
        LeafIcon,
        app = global.app = global.app || {};
    
    LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: "styles/images/leaf-shadow.png",
            iconSize:     [38, 95],
            shadowSize:   [50, 64],
            iconAnchor:   [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor:  [-3, -76]
        }
    });

	LocationService = kendo.Class.extend({
        locationData: null,
        
		init: function () {
			var that = this;

            that.class1 = new LeafIcon({iconUrl: 'styles/images/class1.png'});
            that.class2 = new LeafIcon({iconUrl: 'styles/images/class2.png'});
            that.class3 = new LeafIcon({iconUrl: 'styles/images/class3.png'});
            that.class4 = new LeafIcon({iconUrl: 'styles/images/class4.png'});
            that.class5 = new LeafIcon({iconUrl: 'styles/images/class5.png'});
            that.class6 = new LeafIcon({iconUrl: 'styles/images/class6.png'});
            that.locationData = [];
			that.initModule = $.proxy(that.initData, that);
		},
        
        initData: function () {
            var that = this,
            	q = new Everlive.Query();
        
            q.select("Location", "OzonePercent", "Id");
        
            return app.everlive.data("UserPlants").get(q)
            .then($.proxy(that.storeLocation, that))            
            .then($.proxy(that.updateMarkers, that));
        },
        
        storeLocation: function (data) {
            var currentItem;
            
            for (var i = 0; i < data.result.length; i++) {
                currentItem = data.result[i];
                this.locationData.push([currentItem.Location.latitude, currentItem.Location.longitude, currentItem.OzonePercent]);
            }
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
                latlng = L.latLng(-37.82, 175.24),
                markers = new L.MarkerClusterGroup();
            
            app.common.showLoading();
			
            tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: ""
			});

			map = L.map("map", {center: latlng, zoom: 13, layers: [tiles]});
            
            for (var i = 0; i < that.locationData.length; i++) {
                currentLocationItem =  that.locationData[i];
                
                marker = L.marker(
                    new L.LatLng(
                        currentLocationItem[0], 
                        currentLocationItem[1]), { 
                        title: currentLocationItem[2], 
                        icon: that.getMarkerClass(currentLocationItem[2]) 
                    });
                marker.bindPopup(currentLocationItem[2]);
                markers.addLayer(marker);
            }
            
			map.addLayer(markers);
            
            app.common.hideLoading();
		}
	});

	app.locationService = new LocationService();
})(window);
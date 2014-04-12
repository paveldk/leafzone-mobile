(function (global) {
	var LocationService,
        app = global.app = global.app || {};

	LocationService = kendo.Class.extend({
		init: function () {
			var that = this;

			that.initModule = $.proxy(that.initLocation, that);
		},

		initLocation: function () {
			var that = this,
                LeafIcon,
                tiles,
                map,
                class1,
    			class2,
    			class3,
            	class4,
                class5,
            	class6,
                latlng = L.latLng(-37.82, 175.24),
                markers = new L.MarkerClusterGroup();
            
            app.common.showLoading();
			
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
			
			class1 = new LeafIcon({iconUrl: 'styles/images/class1.png'});
			class2 = new LeafIcon({iconUrl: 'styles/images/class2.png'});
			class3 = new LeafIcon({iconUrl: 'styles/images/class3.png'});
			class4 = new LeafIcon({iconUrl: 'styles/images/class4.png'});
			class5 = new LeafIcon({iconUrl: 'styles/images/class5.png'});
			class6 = new LeafIcon({iconUrl: 'styles/images/class6.png'});

            tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: ""
			});		

			map = L.map("map", {center: latlng, zoom: 13, layers: [tiles]});
            
            for (var i = 0; i < testArray.length; i++) {
                var a = testArray[i];
                var title = a[2];
                var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title, icon: class6 });
                marker.bindPopup(title);
                markers.addLayer(marker);
            }

			map.addLayer(markers);
            
            app.common.hideLoading();
		}
	});

	app.locationService = new LocationService();
})(window);
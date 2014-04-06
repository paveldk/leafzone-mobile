(function (global) {
	var LeafDetailsViewModel,
		LeafDetailsService,
        app = global.app = global.app || {};

	LeafDetailsViewModel = kendo.data.ObservableObject.extend({
		percentage: 0,
		submitedBy: "",
		userName: "",
		disease: "",
		imageId: "",
		location: "",

		imageUrl: function () {
			return app.everlive.Files.getDownloadUrl(this.get("imageId"));
		}
	});

	LeafDetailsService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new LeafDetailsViewModel();
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}

			app.common.showLoading();

			app.everlive.data("UserPlants").getById(dataId)
			.then(function (plantData) {
				return app.everlive.Users.getById(plantData.result.Owner)
				.then(function (userData) {
					that.setData(plantData.result, userData.result);
					app.common.hideLoading();
				})
				.then(null, function (userData) {
					app.common.hideLoading();
				});
			});
		},

		setData: function (plantData, userData) {
			var that = this;

			that.viewModel.set("name", plantData.DiscoveredPlant);
			that.viewModel.set("disease", plantData.DiscoveredDisease || "No diseases");
			that.viewModel.set("percentage", plantData.OzonePercent || 0);
			that.viewModel.set("imageId", plantData.Image);
			that.viewModel.set("userName", userData.DisplayName);
			that.setLocation(plantData);
		},

		setLocation: function (plantData) {
			var that = this,
				geocoder = new google.maps.Geocoder(),
				latlng;

			if (!plantData.Location || !plantData.Location.latitude || !plantData.Location.longitude) {
				that.setNoLocation();
				return;
			}

			latlng = new google.maps.LatLng(plantData.Location.latitude, plantData.Location.longitude);

			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				var locationInfo;

				if (status === google.maps.GeocoderStatus.OK) {
					locationInfo = that.getLocationInfo(results);
					that.viewModel.set("location", locationInfo);
				} else {
					that.setNoLocation();
				}
			});
		},

		setNoLocation: function () {
			this.viewModel.set("location", "No location info");
		},

		getLocationInfo: function (locationsList) {
			var locationInfo,
				result = locationsList[0].formatted_address;

			for (var i = 0; i < locationsList.length; i++) {
				locationInfo = locationsList[i];

				if (locationInfo.types.indexOf("locality") >= 0) {
					result = locationInfo.formatted_address;
				}
			}

			return result;
		}
	});

	app.leafDetailsService = new LeafDetailsService();
})(window);
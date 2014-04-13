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
        userId: "",

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
            that.viewModel.set("userId", userData.Id);
			that.setLocation(plantData);
		},

		setLocation: function (plantData) {
			var that = this;

			if (!plantData.Location || !plantData.Location.latitude || !plantData.Location.longitude) {
				that.setNoLocation();
				return;
			}
            
            app.common.getLocationName(plantData.Location.latitude, plantData.Location.longitude)
            .then($.proxy(that.setLocationName, that), $.proxy(that.setNoLocation, that));
		},
        
		setLocationName: function (locationName) {
			this.viewModel.set("location", locationName);
		},
        
		setNoLocation: function () {
			this.viewModel.set("location", "No location info");
		}
	});

	app.leafDetailsService = new LeafDetailsService();
})(window);
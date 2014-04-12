(function (global) {
	var LeafAlayzeValidationViewModel,
		LeafAlayzeValidationService,
        app = global.app = global.app || {};

	LeafAlayzeValidationViewModel = kendo.data.ObservableObject.extend({
		percentage: 0,
		submitedBy: "",
		userName: "",
		disease: "",
		imageData: "",
		location: "",
		events: {
			validate : "validate"
        },
		
		onValidate: function () {
			var that = this;
			
			that.trigger(that.events.validate, {});
        }
	});

	LeafAlayzeValidationService = kendo.Class.extend({
		viewModel: null,
		lat: "",
		long: "",
		
		init: function () {
			var that = this;

			that.viewModel = new LeafAlayzeValidationViewModel();
			that.showData = $.proxy(that.initData, that);
			that.viewModel.bind(that.viewModel.events.validate, $.proxy(that.onValidate, that));
		},

		initData: function () {
			var that = this;

			app.common.showLoading();
			
			that.setData();

			app.common.getCurrentLocation()
			.then($.proxy(that.updateCoordinates, that))
			.then($.proxy(that.setLocation, that))
			.then(null, $.proxy(that.setNoLocation, that))
			.then($.proxy(app.common.hideLoading, app.common), $.proxy(app.common.hideLoading, app.common));
		},

		setData: function () {
			var that = this;

			that.viewModel.set("name", app.newLeafData.discoveredPlant);
			that.viewModel.set("disease", app.newLeafData.discoveredDisease || "No diseases");
			that.viewModel.set("percentage", app.newLeafData.ozonePercent || 0);
			that.viewModel.set("imageData", app.common.getImageDataForBinding(app.newLeafData.originalImageData));			
			that.viewModel.set("userName", app.currentUser.DisplayName);
		},
		
		updateCoordinates: function (position) {
			var that = this;
			
			that.lat = position.coords.latitude;
			that.long = position.coords.longitude;
        },

		setLocation: function (plantData) {
			var that = this;

            app.common.getLocationName(that.lat, that.long)
            .then($.proxy(that.setLocationName, that), $.proxy(that.setNoLocation, that));
		},
        
		setLocationName: function (locationName) {
			this.viewModel.set("location", locationName);
		},
        
		setNoLocation: function () {
			this.viewModel.set("location", "No location info");
		},
		
		onValidate: function () {
			var that = this;
			
			app.common.showLoading();
			
			that.uploadFiles()
			.then($.proxy(that.createLeafEntry, that))
			.then($.proxy(that.onLeafEntryCreated, that))
			.then(null, $.proxy(that.onError, that));
        },

		uploadFiles: function () {						
			app.everlive.Files
			.create({
				Filename: app.newLeafData.tmblName,
				ContentType: "image/jpeg",
				base64: app.newLeafData.originalImageTmblData
			});
			
			return app.everlive.Files
			.create({
				Filename: app.newLeafData.fileName,
				ContentType: "image/jpeg",
				base64: app.newLeafData.originalImageData
			});
        },		

		createLeafEntry: function (imageData) {
			var that = this;
			
			return app.everlive.data("UserPlants")
			.create({
				DiscoveredPlant: that.viewModel.get("name"),
				DiscoveredDisease:that.viewModel.get("disease"),
				OzonePercent: that.viewModel.get("percentage"),
				Location: new Everlive.GeoPoint(that.long || 0, that.lat || 0),
				Image: imageData.result.Id
			});
		},

		onLeafEntryCreated: function () {			
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafsMine + "?refresh=true");
		},
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.leafAlayzeValidationService = new LeafAlayzeValidationService();
})(window);
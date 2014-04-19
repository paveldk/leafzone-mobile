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
        isKnownPlant: true,
        isKnownDisease: true,
        newPlantCongratVisible: false,
		events: {
			validate : "validate",
            reportPlant: "reportPlant",
            reportDisease: "reportDisease"
        },
		
		onValidate: function () {
			var that = this;
			
			that.trigger(that.events.validate, {});
        },
        
        onReportPlant: function () {
            var that = this;
			
			that.trigger(that.events.reportPlant, {});
        },
        
         onReportDisease: function () {
            var that = this;
			
			that.trigger(that.events.reportDisease, {});
        },
        
        showNewPlantCongrat: function () {
            this.set("newPlantCongratVisible", true);
        },
        
        hideNewPlantCongrat: function () {
            this.set("newPlantCongratVisible", false);
        }
	});

	LeafAlayzeValidationService = kendo.Class.extend({
		viewModel: null,
		lat: "",
		long: "",
        shouldRrportPlant: false,
        shouldReportDisease: false,
		
		init: function () {
			var that = this;

			that.viewModel = new LeafAlayzeValidationViewModel();
			that.showData = $.proxy(that.initData, that);
			that.viewModel.bind(that.viewModel.events.validate, $.proxy(that.onValidate, that));
            that.viewModel.bind(that.viewModel.events.reportPlant, $.proxy(that.onReportPlant, that));
            that.viewModel.bind(that.viewModel.events.reportDisease, $.proxy(that.onReportDisease, that));
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

            that.viewModel.set("isKnownPlant", app.newLeafData.discoveredPlant !== app.consts.UNKNOWN_PLANT_NAME);
            that.viewModel.set("isKnownDisease", app.newLeafData.discoveredDisease !== app.consts.UNKNOWN_DISEASE_NAME);
            that.viewModel.set("newPlantCongratVisible", app.newLeafData.isNewDiscovery);
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
        
        onLeafEntryCreated: function () {
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafsMine + "?refresh=true");
		},
        
        onReportPlant: function () {
            var that = this;
            
            that.shouldRrportPlant = true;
            that.viewModel.set("isKnownPlant", true);
        },
		
		onValidate: function () {
			var that = this;
			
            app.common.showLoading();
          
			that.uploadFiles()
            .then($.proxy(that.reportPlant, that))
            .then($.proxy(that.reportDisease, that))
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
			})
            .then(function (imageData) {
               app.newLeafData.fileId = imageData.result.Id;
            });
        },		

		createLeafEntry: function () {
			var that = this;
			
			return app.everlive.data("UserPlants")
			.create({
				DiscoveredPlant: that.viewModel.get("name"),
				DiscoveredDisease:that.viewModel.get("disease"),
				OzonePercent: that.viewModel.get("percentage"),
				Location: new Everlive.GeoPoint(that.long || 0, that.lat || 0),
				Image: app.newLeafData.fileId
			});
		},
		
        onReportDisease: function () {
            var that = this;
            
            that.shouldReportDisease = true;
            that.viewModel.set("isKnownDisease", true);
        },
        
        reportPlant: function () {
            if (!this.shouldRrportPlant) {
                return new RSVP.all([true]);
            }
            
            return app.everlive.data("Reports")
			.create({
				Type: "Plant",				
				Image: app.newLeafData.fileId
			});
        },
        
        reportDisease: function () {
            if (!this.shouldReportDisease) {
                return new RSVP.all([true]);
            }
            
           return app.everlive.data("Reports")
			.create({
				Type: "Disease",				
				Image: app.newLeafData.fileId
			});
        },

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.leafAlayzeValidationService = new LeafAlayzeValidationService();
})(window);
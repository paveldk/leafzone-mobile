(function (global) {
	var LeafAnalyzeViewModel,
		LeafAnalyzeService,
		app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	LeafAnalyzeViewModel = kendo.data.ObservableObject.extend({
		imageData: "",
		events: {
			submit: "submit",
			reanalize: "reanalize",
			done: "done"
		},

		onSubmit: function () {
			var that = this;

			that.trigger(that.events.submit, {});
		},
		
		onReanalize: function () {
			var that = this;

			that.trigger(that.events.reanalize, {});
		},

		onDone: function () {
			var that = this;

			that.trigger(that.events.done, {});
		}
	});

	LeafAnalyzeService = kendo.Class.extend({
		viewModel: null,
		isSubmitted: false,
		analizeCount: 0,

		init: function () {
			var that = this;

			that.viewModel = new LeafAnalyzeViewModel();
			that.showSubmitData = $.proxy(that.initSubmitData, that);
			that.showAnalyzeData = $.proxy(that.initAnalyzeData, that);

			that.viewModel.bind(that.viewModel.events.submit, $.proxy(that.submitImage, that));
			that.viewModel.bind(that.viewModel.events.reanalize, $.proxy(that.analyzeImage, that));
			that.viewModel.bind(that.viewModel.events.done, $.proxy(that.done, that));
		},

		initSubmitData: function (e) {
			var that = this;

			that.isSubmitted = false;
			that.viewModel.set("imageData", app.newLeafData.originalImageData);
		},

		initAnalyzeData: function (e) {
			var that = this;

			that.isSubmitted = true;
			that.viewModel.set("imageData", app.newLeafData.analyzedlImageData);
		},

		submitImage: function () {
			var that = this;

			app.common.showLoading();

			return that.submitImageData(that.analizeCount)
			.then($.proxy(that.onSubmitSuccess, that))
			.then(null, $.proxy(that.onError, that));
		},
		
		submitImageData: function (submitCount) {
			return new RSVP.Promise(function (resolve, reject) {

				setTimeout(function () {
					resolve({
						imageData: app.newLeafData.originalImageData,
						discoveredPlant: "discoveredPlant",
						discoveredDisease: "discoveredDisease",
						ozonePercent: 10,						
						disease: "disease",
                    });
				}, 1000);
			});
		},

		onSubmitSuccess: function (data) {
			app.newLeafData.analyzedlImageData = data.imageData;
			app.newLeafData.discoveredPlant = data.discoveredPlant;
			app.newLeafData.discoveredDisease = data.discoveredDisease;
			app.newLeafData.ozonePercent = data.ozonePercent;
			
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafAnalyse);
		},

		analyzeImage: function () {
			var that = this;

			that.analizeCount++;
			that.submitImage();
		},
		
		done: function () {
			app.common.navigateToView(app.config.views.leafAnalyseValidation);
		},
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.leafAnalyzeService = new LeafAnalyzeService();
})(window);
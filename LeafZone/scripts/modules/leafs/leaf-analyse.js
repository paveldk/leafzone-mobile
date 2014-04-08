(function (global) {
	var AnalyzeLeafViewModel,
		AnalyzeLeafService,
		app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	AnalyzeLeafViewModel = kendo.data.ObservableObject.extend({
		imageData: "",
		events: {
			submit: "submit",
			takeNew: "takeNew",
			reanalize: "reanalize",
			done: "done"
		},

		onSubmit: function () {
			var that = this;

			that.trigger(that.events.submit, {});
		},

		onTakeNew: function () {
			var that = this;

			that.trigger(that.events.takeNew, {});
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

	AnalyzeLeafService = kendo.Class.extend({
		viewModel: null,
		isSubmitted: false,
		analizeCount: 0,

		init: function () {
			var that = this;

			that.viewModel = new AnalyzeLeafViewModel();
			that.showSubmitData = $.proxy(that.initSubmitData, that);
			that.showAnalyzeData = $.proxy(that.initAnalyzeData, that);

			that.viewModel.bind(that.viewModel.events.takeNew, $.proxy(that.takePicture, that));
			that.viewModel.bind(that.viewModel.events.submit, $.proxy(that.submitImage, that));
			that.viewModel.bind(that.viewModel.events.reanalize, $.proxy(that.analyzeImage, that));
			that.viewModel.bind(that.viewModel.events.done, $.proxy(that.submitLeaf, that));
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

		takePicture: function () {
			var that = this;

			navigator.camera.getPicture(
			$.proxy(that.onGetPicruteSuccess, that),
			$.proxy(that.onError, that),
			{
				quality: 49,
				destinationType: Camera.DestinationType.DATA_URL
			});
		},

		onGetPicruteSuccess: function (imageData) {
			app.newLeafData.originalImageData = imageData;
			this.viewModel.set("imageData", imageData);
		},

		submitImageData: function (submitCount) {
			return new RSVP.Promise(function (resolve, reject) {

				setTimeout(function () {
					resolve(app.newLeafData.originalImageData);
				}, 1000);
			});
		},

		submitImage: function () {
			var that = this;

			app.common.showLoading();

			that.submitImageData(0)
			.then($.proxy(that.onSubmitSuccess, that))
			.then(null, $.proxy(that.onError, that));
		},

		onSubmitSuccess: function (imageData) {
			app.newLeafData.analyzedlImageData = imageData;
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafAnalyse);
		},

		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		},

		analyzeImage: function () {
			var that = this;

			that.analizeCount++;
			that.submitImage(that.analizeCount)
			.then($.proxy(that.onSubmitSuccess, that))
			.then(null, $.proxy(that.onError, that));
		},

		submitLeaf: function () {
			var that = this;

			app.common.showLoading();

			that.createImageEntry()
			.then($.proxy(that.createLeafEntry, that))
			.then($.proxy(that.onLeafEntryCreated, that))
			.then(null, $.proxy(that.onError, that));
		},

		createImageEntry: function () {
			var fileName = app.currentUser.Id + "-" + Date.now();

			return app.everlive.Files
			.create({
				Filename: fileName,
				ContentType: "image/jpeg",
				base64: app.newLeafData.originalImageData
			});
		},

		createLeafEntry: function (imageData) {
			return app.everlive.data("UserPlants")
			.create({
				DiscoveredPlant: "Plant" + Math.round(1000 * Math.random()),
				DiscoveredDisease: "Disease" + Math.round(10 * Math.random()),
				OzonePercent: Math.round(100 * Math.random()),
				Location: new Everlive.GeoPoint(Math.round(100 * Math.random()), Math.round(100 * Math.random())),
				Image: imageData.result.Id
			});
		},

		onLeafEntryCreated: function (leafData) {
			var parameter = "?dataId=" + leafData.result.Id;

			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafDetails + parameter);
		},
	});

	app.analyzeLeafService = new AnalyzeLeafService();
})(window);
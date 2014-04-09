(function (global) {
	var DiseaseDetailsViewModel,
		DiseaseDetailsService,
        app = global.app = global.app || {};

	DiseaseDetailsViewModel = kendo.data.ObservableObject.extend({
		imageId: "",
		name: "",
		control: "",
		symptoms: "",	
		images: null,

		init: function () {
			var that = this;
			
			that.images = [];
			kendo.data.ObservableObject.fn.init.apply(that, arguments);
        },
		
		imageUrl: function () {
			var that = this;
			
			return that.getImageUrl(this.get("imageId"));
		},
		
		getImageUrl: function (imageId) {
			return app.everlive.Files.getDownloadUrl(imageId);
        }
	});

	DiseaseDetailsService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new DiseaseDetailsViewModel();
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}

			app.common.showLoading();

			app.everlive.data("Disease").getById(dataId)
			.then($.proxy(that.setData, that))
			.then(null, $.proxy(that.onError, that));			
		},

		setData: function (plantData) {
			var that = this;

			that.viewModel.set("imageId", plantData.result.MainImage);
			that.viewModel.set("images", plantData.result.Images);
			that.viewModel.set("name", plantData.result.Name);			
			that.viewModel.set("control", that.parseMultiLinesText(plantData.result.Control || ""));	
			that.viewModel.set("symptoms", that.parseMultiLinesText(plantData.result.Symptoms || ""));	
			
			app.common.hideLoading();
		},
		
		parseMultiLinesText: function (text) {
			return text.replace(/\n/g, "<br />");
        },
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.diseaseDetailsService = new DiseaseDetailsService();
})(window);
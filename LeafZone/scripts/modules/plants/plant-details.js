(function (global) {
	var PlantDetailsViewModel,
		PlantDetailsService,
        app = global.app = global.app || {};

	PlantDetailsViewModel = kendo.data.ObservableObject.extend({
		imageId: "",
		name: "",
		botanicalName: "",
		ornamentalCharacteristics: "",
		environmentalCharacteristics: "",
		insectDiseaseCharacteristics: "",
		cultivars: "",
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

	PlantDetailsService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new PlantDetailsViewModel();
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this,
				dataId = e.view.params.dataId;

			if (!dataId) {
				return;
			}

			app.common.showLoading();

			app.everlive.data("Plants").getById(dataId)
			.then($.proxy(that.setData, that))
			.then(null, $.proxy(that.onError, that));			
		},

		setData: function (plantData) {
			var that = this;

			that.viewModel.set("imageId", plantData.result.MainImage);
			that.viewModel.set("images", plantData.result.Images);
			that.viewModel.set("name", plantData.result.Name);			
			that.viewModel.set("botanicalName", plantData.result.BotanicalName);	
			that.viewModel.set("ornamentalCharacteristics", that.parseMultiLinesText(plantData.result.OrnamentalCharacteristics || ""));	
			that.viewModel.set("environmentalCharacteristics", that.parseMultiLinesText(plantData.result.EnvironmentalCharacteristics || ""));	
			that.viewModel.set("insectDiseaseCharacteristics", that.parseMultiLinesText(plantData.result.InsectDiseaseCharacteristics || ""));	
			that.viewModel.set("cultivars", that.parseMultiLinesText(plantData.result.Cultivars || ""));	
			
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

	app.plantDetailsService = new PlantDetailsService();
})(window);
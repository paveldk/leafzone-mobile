(function (global) {
	var DiseasesViewModel,
        DiseasesService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	DiseasesViewModel = kendo.data.ObservableObject.extend({
		diseasesDataSource: null,
	
		init: function () {
			var that = this;

			that.diseasesDataSource = new kendo.data.DataSource();
			kendo.data.ObservableObject.fn.init.apply(that, that);
		}
	});


	DiseasesService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new DiseasesViewModel();
			that.initModule = $.proxy(that.initData, that);
		},

		initData: function () {
			var that = this;

			that.setPlantsData();
		},
		
		setPlantsData: function () {
			var diseasesDataSource = new kendo.data.DataSource({
				type: "everlive",
				transport: {
					typeName: "Disease"
				},
				schema: {
					model: {
						id: Everlive.idField,
						fields: {
							name: {
								field: "Name",
								defaultValue: ""
							},							
							imageId: {
								field: "MainImage",
								defaultValue: ""
							}
						},
						imageUrl: function () {
							return app.everlive.Files.getDownloadUrl(this.get("imageId"));
						}
					}
				},
				serverPaging: true,
				pageSize: 20
			});

			this.viewModel.set("diseasesDataSource", diseasesDataSource);
		}		
	});

	app.diseasesService = new DiseasesService();
})(window);
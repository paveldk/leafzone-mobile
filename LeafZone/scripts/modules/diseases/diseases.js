(function (global) {
	var DiseasesViewModel,
        DiseasesService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	DiseasesViewModel = kendo.data.ObservableObject.extend({
		diseasesDataSource: null,
	
		init: function () {
			var that = this;

            that.diseasesDataSource = new kendo.data.DataSource({ pageSize: app.config.lists.diseases.pageSize });
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

            app.common.showLoading();
			app.common.updateFilesInfo()
			.then($.proxy(that.setPlantsData, that));
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
							var imageId = app.common.getTumbnailIdByImageId(this.get("imageId"));
							
							return app.everlive.Files.getDownloadUrl(imageId);
						}
					}
				},
                requestStart: function(e) {
                    app.common.showLoading();
                },                
                requestEnd: function(e) {
                    app.common.hideLoading();
                },
				serverPaging: true,
				pageSize: app.config.lists.diseases.pageSize 
			});

			this.viewModel.set("diseasesDataSource", diseasesDataSource);
		}		
	});

	app.diseasesService = new DiseasesService();
})(window);
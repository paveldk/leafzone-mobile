(function (global) {
	var PlantsViewModel,
        PlantsService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	PlantsViewModel = kendo.data.ObservableObject.extend({
		plantsDataSource: null,
	
		init: function () {
			var that = this;

            that.plantsDataSource = new kendo.data.DataSource({ pageSize: app.config.lists.plants.pageSize });
			kendo.data.ObservableObject.fn.init.apply(that, that);
		}
	});


	PlantsService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new PlantsViewModel();
			that.initModule = $.proxy(that.initData, that);
		},

		initData: function () {
			var that = this;

            app.common.showLoading();
			app.common.updateFilesInfo()
			.then($.proxy(that.setPlantsData, that));
		},
		
		setPlantsData: function () {
			var plantsDataSource = new kendo.data.DataSource({
				type: "everlive",
				transport: {
					typeName: "Plants"
				},
				schema: {
					model: {
						id: Everlive.idField,
						fields: {
							name: {
								field: "Name",
								defaultValue: ""
							},
							details: {
								field: "BotanicalName",
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
				pageSize: app.config.lists.plants.pageSize
			});

			this.viewModel.set("plantsDataSource", plantsDataSource);
		}		
	});

	app.plantsService = new PlantsService();
})(window);
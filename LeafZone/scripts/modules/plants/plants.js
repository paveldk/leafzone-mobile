(function (global) {
	var PlantsViewModel,
        PlantsService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	PlantsViewModel = kendo.data.ObservableObject.extend({
		plantsDataSource: null,
	
		init: function () {
			var that = this;

			that.plantsDataSource = new kendo.data.DataSource();
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

			that.setPlantsData();
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
							return app.everlive.Files.getDownloadUrl(this.get("imageId"));
						}
					}
				},
				serverPaging: true,
				pageSize: 20
			});

			this.viewModel.set("plantsDataSource", plantsDataSource);
		}		
	});

	app.plantsService = new PlantsService();
})(window);
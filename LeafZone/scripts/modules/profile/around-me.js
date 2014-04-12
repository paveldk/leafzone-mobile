(function (global) {
	var AroundViewModel,
		AroundService,
        app = global.app = global.app || {};

	AroundViewModel = kendo.data.ObservableObject.extend({
		username: "",
		email: "",
		displayName: "",
		recorededLeafs: ""
	});

	AroundService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new AroundViewModel();
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this;
			
			app.common.showLoading();

			app.everlive.data("UserPlants").count({Owner: app.currentUser.Id})
			.then($.proxy(that.setData, that))
			.then(null, $.proxy(that.onError, that));			
		},

		setData: function (count) {
			var that = this;

			that.viewModel.set("username", app.currentUser.Username);
			that.viewModel.set("email", app.currentUser.Email);
			that.viewModel.set("displayName", app.currentUser.DisplayName);
			that.viewModel.set("recorededLeafs", count.result);			
			
			app.common.hideLoading();
		},
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.aroundService = new AroundService();
})(window);
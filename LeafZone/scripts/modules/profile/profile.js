(function (global) {
	var ProfileViewModel,
		ProfileService,
        app = global.app = global.app || {};

	ProfileViewModel = kendo.data.ObservableObject.extend({
		username: "",
		email: "",
		displayName: "",
		recorededLeafs: ""
	});

	ProfileService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new ProfileViewModel();
			that.showData = $.proxy(that.initData, that);
		},

		initData: function (e) {
			var that = this,
                countPromise,
                userPromise,
				userId = e.view.params.userId;

			if (!userId) {
				userId = app.currentUser.Id;
			}
			
			app.common.showLoading();

			countPromise = app.everlive.data("UserPlants").count({Owner: userId});
            userPromise = app.everlive.data("Users").getById(userId);
            
            RSVP.all([userPromise, countPromise])
			.then($.proxy(that.setData, that))
			.then(null, $.proxy(that.onError, that));			
		},

		setData: function (data) {
			var that = this,
                userData = data[0].result,
                plantsCountData = data[1].result;

			that.viewModel.set("username", userData.Username);
			that.viewModel.set("email", userData.Email);
			that.viewModel.set("displayName", userData.DisplayName);
			that.viewModel.set("recorededLeafs", plantsCountData);			
			
			app.common.hideLoading();
		},
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.profileService = new ProfileService();
})(window);
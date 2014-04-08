(function (global) {
	var NewLeafViewModel,
        NewLeafService,
        app = global.app = global.app || {};

	app.newLeafData = app.newLeafData || {};

	NewLeafViewModel = kendo.data.ObservableObject.extend({		
		onGetNewPhoto: function () {
			this.getPhoto(Camera.PictureSourceType.CAMERA);
		},
		
		onSelectExistingPhoto: function () {
			this.getPhoto(Camera.PictureSourceType.SAVEDPHOTOALBUM);
		},
		
		getPhoto: function(sourceType) {
			var that = this;

			navigator.camera.getPicture(
			$.proxy(that.onGetPicruteSuccess, that),
			$.proxy(that.onGetPicruteError, that),
			{
				quality: 49,
				sourceType :sourceType,
				destinationType: Camera.DestinationType.DATA_URL
			});
        },

		onGetPicruteSuccess: function (imageData) {
			app.newLeafData.originalImageData = imageData;
			app.common.navigateToView(app.config.views.leafSubmit);
		},

		onGetPicruteError: function (e) {}
	});

	NewLeafService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new NewLeafViewModel();
			that.initModule = $.proxy(that.initData, that);
		},
		
		initData: function () {			
		}
	});

	app.newLeafService = new NewLeafService();
})(window);
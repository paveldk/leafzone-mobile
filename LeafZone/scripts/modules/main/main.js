(function (global) {
	var NewLeafViewModel,
        NewLeafService,
		imageWidth = 1440,
		imageHeight = 1440,
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
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.FILE_URI
			});
        },

		onGetPicruteSuccess: function (imageUrl) {
			var that = this;
			
			 app.common.resizeImage(imageUrl, imageWidth, imageHeight, false)
			.then($.proxy(that.onPictureReady, that));
		},

		onGetPicruteError: function (e) {},
						
		onPictureReady: function (imageData) {
			var prefix = "data:image/jpeg;base64,";

			app.newLeafData.originalImageData = imageData.substr(prefix.length, imageData.length);
			app.common.navigateToView(app.config.views.leafSubmit);
        }
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
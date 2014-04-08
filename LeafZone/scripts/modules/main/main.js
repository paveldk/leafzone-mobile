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
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.FILE_URI
			});
        },

		onGetPicruteSuccess: function (imageUrl) {
			var that = this,
				resizeImagePromise,
				createTumbnailPromise;
			
			app.common.showLoading();
			
			resizeImagePromise = app.common.resizeImage(imageUrl, app.config.images.imageWidth, app.config.images.ImageHeight, false);
			createTumbnailPromise = app.common.resizeImage(imageUrl,  app.config.images.tumbnailSize,  app.config.images.tumbnailSize, true);
			
			RSVP.all([resizeImagePromise, createTumbnailPromise])
			.then($.proxy(that.onPictureReady, that), $.proxy(that.onError, that));
		},

		onGetPicruteError: function (e) {},
						
		onPictureReady: function (imageData) {
			var prefix = "data:image/jpeg;base64,";

			app.newLeafData.originalImageData = imageData[0].substr(prefix.length, imageData[0].length);
			app.newLeafData.originalImageTmblData = imageData[1].substr(prefix.length, imageData[1].length);
			app.common.hideLoading();
			app.common.navigateToView(app.config.views.leafSubmit);
        },
		
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
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
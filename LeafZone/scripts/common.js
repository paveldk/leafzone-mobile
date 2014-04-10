(function (global) {
	var app = global.app = global.app || {};

	app.images = app.imagesList || {};

	function notification(title, message) {
		navigator.notification.alert(message, function () { }, title, "OK");
	}

	function showLoading() {
		kendo.mobile.application.showLoading();
	}

	function hideLoading() {
		kendo.mobile.application.hideLoading();
	}

	function navigateToView(view) {
		kendo.mobile.application.navigate(view);
	}


	function resizeImage(url, targetWidth, targetHeight, crop) {
		var imageObj = new Image();

		imageObj.crossOrigin = "Anonymous";

		return new RSVP.Promise(function (resolve, reject) {
			imageObj.onload = function () {
				var context,
                    ratio,
                    imageData,
                    result,
                    width = imageObj.width,
                    height = imageObj.height,
                    widthOffset = 0,
                    heightOffset = 0,
                    canvas = document.createElement("canvas");

				if (width < height) {
					ratio = targetHeight / height;
				} else {
					ratio = targetWidth / width;
				}

				canvas.width = width * ratio;
				canvas.height = height * ratio;

				widthOffset = (canvas.width - targetWidth) / 2;
				heightOffset = (canvas.height - targetHeight) / 2;

				context = canvas.getContext("2d");
				context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);


				if (crop) {
					imageData = context.getImageData(widthOffset, heightOffset, targetWidth, targetHeight);

					canvas.width = targetWidth;
					canvas.height = targetHeight;
					context = canvas.getContext("2d");
					context.putImageData(imageData, 0, 0);
				}

				result = canvas.toDataURL("image/jpeg");

				resolve(result);
			};

			imageObj.src = url;
		})
	}

	function updateFilesInfo() {
		var q = new Everlive.Query();

		q.select("Filename", "Uri", "Id");

		return app.everlive.data("Files").get(q)
		.then(function (data) {
			var currentItem;

			app.images.idMap = {};
			app.images.nameMap = {};


			for (var i = 0; i < data.result.length; i++) {
				currentItem = data.result[i];

				app.images.idMap[currentItem.Id] = currentItem;
				app.images.nameMap[currentItem.Filename] = currentItem;
			}

			return data.result;
		});
	}	

	function getTumbnailIdByImageId(imageId) {
		var fileName,
			tumbnailName;

		if (!app.images.idMap[imageId]) {
			return imageId;
		}

		fileName = app.images.idMap[imageId].Filename,
		tumbnailName = app.config.images.tumbnailPrefix + fileName;

		if (!app.images.nameMap[tumbnailName]) {
			return imageId;
		}

		return app.images.nameMap[tumbnailName].Id;
	}

	app.common = {
		notification: notification,
		showLoading: showLoading,
		hideLoading: hideLoading,
		navigateToView: navigateToView,
		resizeImage: resizeImage,
		updateFilesInfo: updateFilesInfo,
		getTumbnailIdByImageId: getTumbnailIdByImageId
	};
})(window);
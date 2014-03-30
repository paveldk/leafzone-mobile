(function (global) {
	var app = global.app = global.app || {};

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

	app.common = {
		notification: notification,
		showLoading: showLoading,
		hideLoading: hideLoading,
		navigateToView: navigateToView
	};
})(window);
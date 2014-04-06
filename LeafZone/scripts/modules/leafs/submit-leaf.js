(function (global) {
    var SubmitLeafViewModel,
        SubmitLeafService,
        app = global.app = global.app || {};
	
	app.newLeafData = app.newLeafData || {};

    SubmitLeafViewModel = kendo.data.ObservableObject.extend({
        imageData: "",
        isSubmitted: false,
        events: {
            submit: "submit",
            takeNew: "takeNew"
        },

        onSubmit: function () {
            var that = this;

            that.trigger(that.events.submit, {});
        },

        onTakeNew: function () {
            var that = this;

            that.trigger(that.events.takeNew, {});
        }
    });

    SubmitLeafService = kendo.Class.extend({
        viewModel: null,

        init: function () {
            var that = this;

            that.viewModel = new SubmitLeafViewModel();
            that.showData = $.proxy(that.initData, that);

            that.viewModel.bind(that.viewModel.events.takeNew, $.proxy(that.takePicture, that));
            that.viewModel.bind(that.viewModel.events.submit, $.proxy(that.submit, that));
        },

        initData: function (e) {
            that.viewModel.set("imageData", app.newLeafData.originalImageData);
        },

        takePicture: function () {
            var that = this;
			
			navigator.camera.getPicture(
			$.proxy(that.onGetPicruteSuccess, that),
	        $.proxy(that.onError, that), 
			{
                quality: 49,
	            destinationType: Camera.DestinationType.DATA_URL              
            });
        },

        onGetPicruteSuccess: function (imageData) {
			app.newLeafData.originalImageData = imageData;
			this.viewModel.set("imageData", imageData);
        },

        submit: function () {
            var that = this;

            app.common.showLoading();

            that.submitImage()
            .then($.proxy(that.onSuccess, that))
            .then(null, $.proxy(that.onError, that));
        },

        submitImage: function () {
            return new RSVP.Promise(function (resolve, reject) {

                setTimeout(function () {
                    resolve(app.newLeafData.originalImageData);
                }, 1000);
            });
        },

        onSuccess: function (imageData) {
			app.newLeafData.analyzedlImageData = imageData;
            app.common.hideLoading();
            app.common.navigateToView(app.config.views.analizeLeaf);
        },

        onError: function (e) {
            app.common.hideLoading();
            app.common.notification("Error", e.message);
        }
    });

    app.submitLeafService = new SubmitLeafService();
})(window);
(function (global) {
    var AnalyzeLeafViewModel,
        AnalyzeLeafService,
        app = global.app = global.app || {};

    AnalyzeLeafViewModel = kendo.data.ObservableObject.extend({
        imageData: "",
		isSubmitted: false,
        events: {
            reanalyze: "reanalyze",
            done: "done"
        },
		
        onReanalyze: function () {
            var that = this;

            that.trigger(that.events.reanalyze, {});
        },

        onDone: function () {
            var that = this;

            that.trigger(that.events.done, {});
        }
    });

    AnalyzeLeafService = kendo.Class.extend({
        viewModel: null,
		imageUrl: "",
        analyzesCount: 0,

        init: function () {
            var that = this;

            that.viewModel = new AnalyzeLeafViewModel();
            that.showData = $.proxy(that.initData, that);

            that.viewModel.bind(that.viewModel.events.reanalyze, $.proxy(that.analyze, that));
            that.viewModel.bind(that.viewModel.events.done, $.proxy(that.done, that));
        },

        initData: function (e) {
            this.viewModel.set("imageData", app.newLeafData.analyzedlImageData);
        },

        analyze: function () {
            var that = this;

            that.analyzeImage()
            .then($.proxy(that.onSuccess, that))
            .then(null, $.proxy(that.onError, that));
        },
		
		analyzeImage: function () {
            return new RSVP.Promise(function (resolve, reject) {

                setTimeout(function () {
                    resolve(app.newLeafData.originalImageData);
                }, 1000);
            });
        },

        done: function () {
            var that = this;
			
			app.common.showLoading();
						
			that.fakeServerCall()
			.then($.proxy(that.createEverliveRecord, that))
			.then($.proxy(that.onLeafCreated, that))
			.then(null, $.proxy(that.onError, that));
        },
		
		fakeServerCall: function() {
			return new RSVP.Promise(function(resolve, reject) {
			  
				setTimeout(function(){
					 resolve();
                }, 1000);
			});
        },

        createEverliveRecord: function (leafData) {
            return app.everlive.data("UserPlants")
                .create({
					"DiscoveredPlant": "DiscoveredPlant" + new Date().toString(),
					"DiscoveredDisease": "DiscoveredDisease" + new Date().toString(),
					"OzonePercent": 100 * Math.random(),
					"Location": new Everlive.GeoPoint(50 * Math.random(), 50 * Math.random())
                });
        },

        onLeafCreated: function (leafData) {
			var parameter = "?dataId=" + leafData.result.Id;

			app.common.hideLoading();
            app.common.navigateToView(app.config.views.leafDetails + parameter);
        },
		
        onError: function (e) {
			app.common.hideLoading();
            app.common.notification("Error", e.message);
        }
    });

    app.analizeLeafService = new AnalyzeLeafService();
})(window);
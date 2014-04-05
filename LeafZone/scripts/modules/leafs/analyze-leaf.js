(function (global) {
    var AnalyzeLeafViewModel,
        AnalyzeLeafService,
        app = global.app = global.app || {};

    AnalyzeLeafViewModel = kendo.data.ObservableObject.extend({
        imageUrl: "",
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
        analyzesCount: 0,

        init: function () {
            var that = this;

            that.viewModel = new AnalyzeLeafViewModel();
            that.showData = $.proxy(that.initData, that);

            that.viewModel.bind(that.viewModel.events.reanalyze, $.proxy(that.analyze, that));
            that.viewModel.bind(that.viewModel.events.done, $.proxy(that.done, that));
        },

        initData: function (e) {
            var that = this,
                fileUrl = e.view.params.fileUrl;


            that.viewModel.set("imageUrl", fileUrl);
            this.analyze();
        },

        analyze: function () {
            var that = this;

            //call to the image recognition server
        },

        done: function () {
            var that = this;

            //callo to image recognition server for final analysis
            //.then($.proxy(that.createEverliveRecord, that))
            //.then(null, $.proxy(that.onError, that))
        },

        createEverliveRecord: function (leafData) {
            app.everlive.data("UserPlants")
                .create({})
                .then($.proxy(that.onEonLeafCreatedrror, that))
                .then(null, $.proxy(that.onError, that));
        },

        onLeafCreated: function (leafData) {
			var parameter = "?dataId=" + leafData.result.Id;

            app.common.navigateToView(app.config.views.leafDetails + parameter);
        },

        onError: function (e) {
            app.common.notification("Error", e.message);
        }
    });

    app.analizeLeafService = new AnalyzeLeafService();
})(window);
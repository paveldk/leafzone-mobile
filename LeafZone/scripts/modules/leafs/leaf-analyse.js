(function (global) {
    var LeafAnalyzeViewModel,
        LeafAnalyzeService,
        app = global.app = global.app || {};
    
    app.newLeafData = app.newLeafData || {};
    
    LeafAnalyzeViewModel = kendo.data.ObservableObject.extend({
        imageData: "",
        events: {
            submit: "submit",
            reanalize: "reanalize",
            done: "done"
        },
        
        onSubmit: function () {
            var that = this;
            
            that.trigger(that.events.submit, {});
        },
        
        onReanalize: function () {
            var that = this;
            
            that.trigger(that.events.reanalize, {});
        },
        
        onDone: function () {
            var that = this;
            
            that.trigger(that.events.done, {});
        }
    });
    
    LeafAnalyzeService = kendo.Class.extend({
        viewModel: null,
        isSubmitted: false,
        analizeCount: 0,
        
        init: function () {
            var that = this;
            
            that.viewModel = new LeafAnalyzeViewModel();
            that.showSubmitData = $.proxy(that.initSubmitData, that);
            that.showAnalyzeData = $.proxy(that.initAnalyzeData, that);
            
            that.viewModel.bind(that.viewModel.events.submit, $.proxy(that.submitImage, that));
            that.viewModel.bind(that.viewModel.events.reanalize, $.proxy(that.analyzeImage, that));
            that.viewModel.bind(that.viewModel.events.done, $.proxy(that.done, that));
        },
        
        initSubmitData: function (e) {
            var that = this;
            
            that.isSubmitted = false;
            that.viewModel.set("imageData", app.common.getImageDataForBinding(app.newLeafData.originalImageData));
        },
        
        initAnalyzeData: function (e) {
            var that = this;
            
            that.isSubmitted = true;
            that.viewModel.set("imageData", app.common.getImageDataForBinding(app.newLeafData.analyzedlImageData));
        },
        
        submitImage: function () {
            var that = this;
            
            app.common.showLoading();
            
            return that.submitImageData(that.analizeCount)
            .then($.proxy(that.onSubmitSuccess, that))
            .then(null, $.proxy(that.onError, that));
        },
        
        submitImageData: function (submitCount) {
            var data = {
                ImageName: app.newLeafData.fileName,
                ImageBase64: app.newLeafData.originalImageData
            };
            
            return new RSVP.Promise(function (resolve, reject) {
                setTimeout(function(){
                    resolve("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");
                }, 500);                
            });
        },
        
        onSubmitSuccess: function (analyzedlImageData) {
            app.newLeafData.discoveredPlant = "data.PlantName";
            app.newLeafData.discoveredDisease = "Unknown";
            app.newLeafData.ozonePercent = 0;
            
            app.newLeafData.analyzedlImageData = analyzedlImageData;
            app.common.hideLoading();
            app.common.navigateToView(app.config.views.leafAnalyse);            
        },
        
        analyzeImage: function () {
            var that = this;
            
            that.analizeCount++;
            that.submitImage();
        },
        
        done: function () {
            app.common.navigateToView(app.config.views.leafAnalyseValidation);
        },
        
        onError: function (e) {
            app.common.hideLoading();
            app.common.notification("Error", e.message);
        }
    });
    
    app.leafAnalyzeService = new LeafAnalyzeService();
})(window);
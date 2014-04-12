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
                $.ajax({
                    type: "POST",
                    url: "http://leafzoneservices.keydown.org/api/analyze",
                    data: data
                })
                .then(function (data) { resolve(data); }, function (err) { reject(err); });                
            });
        },
        
        onSubmitSuccess: function (data) {
            app.newLeafData.discoveredPlant = data.PlantName;
            app.newLeafData.discoveredDisease = data.DiseaseName;
            app.newLeafData.ozonePercent = data.OzoneAffected;
            
           // app.common.getResizedImage(data.ImageUrl)
            //.then(function (analyzedlImageData) {
             //   app.newLeafData.analyzedlImageData = analyzedlImageData;
              //  app.common.hideLoading();
               // app.common.navigateToView(app.config.views.leafAnalyse);
            //});
            
              app.newLeafData.analyzedlImageData = app.newLeafData.originalImageData;
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
(function (global) {
    var LeafsViewModel,
        LeafsService,
        app = global.app = global.app || {};
    
    LeafsViewModel = kendo.data.ObservableObject.extend({
        allPlantsDataSource: null,
        userPlantsDataSource: null,
        
        init: function (){
            var that = this;
            
            that.allPlantsDataSource = new kendo.data.DataSource();
            that.userPlantsDataSource = new kendo.data.DataSource();
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
        
        setData: function(allPlantsData, userPlantsData) {
            var that = this;
            
            that.get("allPlantsDataSource").data(allPlantsData);
            that.get("userPlantsDataSource").data(userPlantsData);
        }        
    });
    
    LeafsService = kendo.Class.extend({
        viewModel: null,
        
        init: function () {
            var that = this;
            
            that.viewModel = new LeafsViewModel();            
            that.initModule = $.proxy(that.initData, that);
        },
        
        getUserPlants: function() {
            return app.everlive.Users.currentUser()
            .then(function(userWrap){
                var data = app.everlive.data("UserPlants"),
                    filter = new Everlive.Query();
                
                filter.where().eq("Owner", userWrap.result.Id);            
                return data.get(filter)            
            });
        },
        
        getAllPlants: function () {                  
            return app.everlive.data("Plants").get();            
        },
        
        initData: function() {
            var that = this;
            
            RSVP.all([that.getAllPlants(), that.getUserPlants()])
            .then($.proxy(that.setData, that));
        },
        
        setData: function (data) {
            this.viewModel.setData(data[0].result, data[1].result);
        }
    });
    
    app.leafsService = new LeafsService();    
})(window);
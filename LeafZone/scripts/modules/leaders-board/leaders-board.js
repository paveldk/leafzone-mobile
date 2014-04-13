(function (global) {
	var LeadersBoardViewModel,
		LeadersBoardService,
        app = global.app = global.app || {};

	AroundMeViewModel = kendo.data.ObservableObject.extend({
        leadersList: null,
        
        init: function () {
            var that = this;
            
            that.leadersList = [];
            
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
	});

	LeadersBoardService = kendo.Class.extend({
		viewModel: null,

		init: function () {
			var that = this;

			that.viewModel = new LeadersBoardViewModel();
			that.showData = $.proxy(that.updateData, that);
		},

		updateData: function (e) {
			var that = this;
			
			app.common.showLoading();
            
            app.common.getCurrentLocation()
            .then($.proxy(that.getNearLeafs, that))
            .then($.proxy(that.setData, that))
            .then(null, $.proxy(that.onError, that));
		},
        
        getNearLeafs: function (position) {
            var query = new Everlive.Query();
            
            query.where().withinCenterSphere(
                "Location", 
                new Everlive.GeoPoint(position.coords.longitude, position.coords.latitude), 
                app.config.data.aroundMe.rangeKM, 
                "km");
            
            return app.everlive.data("UserPlants").get(query);
        },

		setData: function (data) {
			var that = this;

			that.setAverageOzoneAffection(data);
            //that.setTopPlants(data);
            //that.setTopDiseases(data);
			
			app.common.hideLoading();
		},
        
        setAverageOzoneAffection: function (data) {
            var averageAffection,
            	ozoneAffectionSum = 0,
            	leafsList = data.result;
            
            for (var i = 0; i < leafsList.length; i++) {
                ozoneAffectionSum += leafsList[i].OzonePercent;
            }
            
            averageAffection = Math.round(ozoneAffectionSum / leafsList.length) || 0;            
            this.viewModel.set("ozoneAffected", averageAffection);
        },

        setTopPlants: function (data) {
          var that = this,
              currentItem,
              plantsMap = {},
              leafsList = data.result;
            
            for (var i = 0; i < leafsList.length; i++) {
                currentItem = leafsList[i]
                plantsMap[currentItem.DiscoveredDisease] = plantsMap[currentItem.DiscoveredDisease] || 0;
                plantsMap[currentItem.DiscoveredDisease]++;                
            }
        },
        
        
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.leadersBoardService = new LeadersBoardService();
})(window);
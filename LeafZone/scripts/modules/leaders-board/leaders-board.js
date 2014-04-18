(function (global) {
	var LeadersBoardViewModel,
		LeadersBoardService,
        app = global.app = global.app || {};

	LeadersBoardViewModel = kendo.data.ObservableObject.extend({
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
            
            that.getLeaders()
            .then($.proxy(that.getLeaders, that))
            .then($.proxy(that.setData, that))
            .then(null, $.proxy(that.onError, that));
		},
        
        getLeaders: function () {
            var that = this,
                powerField = {
                    PlantsCount: {
                        contentType: "UserPlants",
                        queryType: "count",
                        filter: {
                            Owner: "${Id}"
                        },
                    }                    
                };
            
            return that.getContent("Users", powerField);
        },
        
        setData: function (data) {
            var that = this;
            
            data.Result.sort(that.sort);
            that.viewModel.set("leadersList", data.Result);
            app.common.hideLoading();
        },
        
         sort: function (x, y) {
            if (x.PlantsCount < y.PlantsCount) {
                return 1;
            } else if (x.PlantsCount > y.PlantsCount) {
                return -1;
            } else {                
                return 0;
            }
        },
        
        getContent: function (table, powerField) {
            return new RSVP.Promise(function (resolve, reject) {
                $.ajax({
                    url: app.everlive.buildUrl() + table,
                    type: "GET",
                    headers: {
                        "Authorization": app.everlive.buildAuthHeader().Authorization,
                        "X-Everlive-Power-Fields": JSON.stringify(powerField)
                    },
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
        
		onError: function (e) {
			app.common.hideLoading();
			app.common.notification("Error", e.message);
		}
	});

	app.leadersBoardService = new LeadersBoardService();
})(window);
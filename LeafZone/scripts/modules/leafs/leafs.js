(function (global) {
    var LeafsViewModel,
        LeafsService,
        app = global.app = global.app || {};
    
    LeafsViewModel = kendo.data.ObservableObject.extend({
        appUserPlantsDataSource: null,
        myPlantsDataSource: null,
        myPlantsSelected: true,
				
        init: function () {
            var that = this;
		    
			that.myPlantsSelected = true;			
			that.appUserPlantsDataSource = new kendo.data.DataSource();
			that.myPlantsDataSource = new kendo.data.DataSource();			            
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
		
		onMyLeafsClick: function() {
			this.set("myPlantsSelected", true);			
		},
		
		onAllLeafsClick: function() {
			this.set("myPlantsSelected", false);			
		}
    });
    
    LeafsService = kendo.Class.extend({
        viewModel: null,
        
        init: function () {                     
			var that = this;
			
			that.viewModel = new LeafsViewModel();
			that.initModule = $.proxy(that.initData, that);
        },
		
		setAllUserPlantsData: function() {
			var appUserPlantsDataSource = new kendo.data.DataSource({
					type: "everlive",
				    transport: {
				        typeName: "UserPlants"
				    },
				    schema: {
						model: { 
							id: Everlive.idField ,
							fields: {
								name: {
									field: "DiscoveredPlant",
									defaultValue: ""
								},
								details: {
									field: "DiscoveredDisease",
									defaultValue: ""
								},
								imageId: {
									field: "Image",
									defaultValue: ""
								}			               
							},
							imageUrl: function() {
								return app.everlive.Files.getDownloadUrl(this.get("imageId"));
	                        }
						}
				    },
				    serverPaging: true,			    
				    pageSize: 20
	            });	
			
			this.viewModel.set("appUserPlantsDataSource", appUserPlantsDataSource);
        },
		
		setMyPlantsData: function() {
			var myPlantsDataSource = new kendo.data.DataSource({
					type: "everlive",
				    transport: {
				        typeName: "UserPlants"
				    },
				    schema: {
						model: { 
							id: Everlive.idField ,
							fields: {
								name: {
									field: "DiscoveredPlant",
									defaultValue: ""
								},
								details: {
									field: "DiscoveredDisease",
									defaultValue: ""
								},
								imageId: {
									field: "Image",
									defaultValue: ""
								}			               
							},
							imageUrl: function() {
								return app.everlive.Files.getDownloadUrl(this.get("imageId"));
	                        }
						}
				    },
					filter: { field: "Owner", operator: "eq", value: app.currentUser.Id },
				    serverPaging: true,			    
				    pageSize: 20
	            });
			
			this.viewModel.set("myPlantsDataSource", myPlantsDataSource);
        },		
		
		initData: function() {
			var that = this;
			
			that.setAllUserPlantsData();
			that.setMyPlantsData();
		}
    });
    
    app.leafsService = new LeafsService();    
})(window);
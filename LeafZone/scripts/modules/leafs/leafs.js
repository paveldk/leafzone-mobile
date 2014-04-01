(function (global) {
    var LeafsViewModel,
        LeafsService,
        app = global.app = global.app || {};
    
    LeafsViewModel = kendo.data.ObservableObject.extend({
        allPlantsDataSource: null,
        userPlantsDataSource: null,
        myPlantsSelected: true,
				
        init: function () {
            var that = this;
		    
			that.myPlantsSelected = true;			
			that.allPlantsDataSource = new kendo.data.DataSource();
			that.userPlantsDataSource = new kendo.data.DataSource();			            
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
		
		setAllPlantsData: function() {
			var allPlantsDataSource = new kendo.data.DataSource({
					type: "everlive",
				    transport: {
				        typeName: "Plants"
				    },
				    schema: {
				        model: { 
							id: Everlive.idField ,
							fields: {
								name: {
									field: "Name",
									defaultValue: ""
								},
								details: {
									field: "BotanicalName",
									defaultValue: ""
								},
								imageId: {
									field: "MainImage",
									defaultValue: ""
								}			               
							},
							imageUrl: function() {
								return app.everlive.Files.getDownloadUrl(this.get("imageId"));
	                        }
						}
				    },
				    serverPaging: true,			    
				    pageSize: 10
	            });	
			
			this.viewModel.set("allPlantsDataSource", allPlantsDataSource);
        },
		
		setMyPlantsData: function() {
			var userPlantsDataSource = new kendo.data.DataSource({
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
				    pageSize: 10
	            });
			
			this.viewModel.set("userPlantsDataSource", userPlantsDataSource);
        },		
		
		initData: function() {
			var that = this;
			
			that.setAllPlantsData();
			that.setMyPlantsData();
		}
    });
    
    app.leafsService = new LeafsService();    
})(window);
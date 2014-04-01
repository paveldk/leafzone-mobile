(function (global) {
    var LeafsViewModel,
        LeafsService,
        app = global.app = global.app || {};
    
    LeafsViewModel = kendo.data.ObservableObject.extend({
        allPlantsDataSource: null,
        userPlantsDataSource: null,
        myPlantsSelected: true,
		myLeafsButtonClass: "",
		allLeafsButtonClass: "",
		consts: {
			SELECTED_BUTTON_CLASS: "lz-button lz-button-footer checked",
			UNSELECTED_BUTTON_CLASS: "lz-button lz-button-footer"
		},
		
        init: function () {
            var that = this;
		    
			that.myPlantsSelected = true;
			that.myLeafsButtonClass = that.consts.SELECTED_BUTTON_CLASS;
			that.allLeafsButtonClass = that.consts.UNSELECTED_BUTTON_CLASS;
			
            that.allPlantsDataSource = new kendo.data.DataSource({
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
			    pageSize: 5
            });	
			
			
            that.userPlantsDataSource = new kendo.data.DataSource({
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
				//filter: { field: "Owner", operator: "eq", value: app.currentUser.Id },
			    serverPaging: true,			    
			    pageSize: 5
            });	
			            
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
			this.viewModel = new LeafsViewModel();      
        }		
    });
    
    app.leafsService = new LeafsService();    
})(window);
(function (global) {
    var LeafsViewModel,
        LeafsService,
        app = global.app = global.app || {};
    
    app.newLeafData = app.newLeafData || {};
    
    LeafsViewModel = kendo.data.ObservableObject.extend({
        allUserPlantsDataSource: null,
        myPlantsDataSource: null,
        myPlantsSelected: true,
        
        init: function () {
            var that = this;
            
            that.myPlantsSelected = true;
            that.allUserPlantsDataSource = new kendo.data.DataSource({ pageSize: app.config.data.leafs.pageSize });
            that.myPlantsDataSource = new kendo.data.DataSource({ pageSize: app.config.data.leafs.pageSize });
            kendo.data.ObservableObject.fn.init.apply(that, that);
        },
        
        onMyLeafs: function () {
            this.set("myPlantsSelected", true);
        },
        
        onAllLeafs: function () {
            this.set("myPlantsSelected", false);
        },
        
        onNewLeaf: function () {
            var that = this;
            
            navigator.camera.getPicture(
                $.proxy(that.onGetPicruteSuccess, that),
                $.proxy(that.onGetPicruteError, that),
                {
                    quality: 49,
                    destinationType: Camera.DestinationType.DATA_URL
                });
        },
        
        onGetPicruteSuccess: function (imageData) {
            app.newLeafData.originalImageData = imageData;
            app.common.navigateToView(app.config.views.leafSubmit);
        },
        
        onGetPicruteError: function (e) {
            app.common.notification("Error", e.message);
        },
    });
    
    LeafsService = kendo.Class.extend({
        viewModel: null,
        userPlantsNamesList: null,
        
        init: function () {
            var that = this;
            
            that.allPlantsNamesList = [];
            
            that.viewModel = new LeafsViewModel();
            that.initLeafsMineModule = $.proxy(that.initMyLeafsData, that);
            that.initLeafsAllModule = $.proxy(that.initAllLeafsData, that);
            that.showLeafsMineModule = $.proxy(that.refreshMyLeafsData, that);
        },
        
        setAllUserPlantsData: function () {
            var that = this,
                allUserPlantsDataSource = new kendo.data.DataSource({
                    type: "everlive",
                    transport: {
                        typeName: "UserPlants"
                    },
                    schema: {
                        model: {
                            id: Everlive.idField,
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
                            imageUrl: function () {
                                var imageId = app.common.getTumbnailIdByImageId(this.get("imageId"));
                                
                                return app.everlive.Files.getDownloadUrl(imageId);
                            },
                            isDiscovered: function () {
                                var name = this.get("name");
                                
                                return that.userPlantsNamesList.indexOf(name) > -1;
                            }
                        }
                    },
                    requestStart: function(e) {
                        app.common.showLoading();
                    },                
                    requestEnd: function(e) {
                        app.common.hideLoading();
                        that.updatePlantsNamesList(e.response.Result || []);
                    },
                    sort: { 
                        field: "CreatedAt", 
                        dir: "desc"
                    },
                    serverPaging: true,
                    serverSorting: true,
                    pageSize: app.config.data.leafs.pageSize
                });
            
            this.viewModel.set("allUserPlantsDataSource", allUserPlantsDataSource);
        },
        
        setMyPlantsData: function () {
            var myPlantsDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "UserPlants"
                },
                schema: {
                    model: {
                        id: Everlive.idField,
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
                        imageUrl: function () {
                            var imageId = app.common.getTumbnailIdByImageId(this.get("imageId"));
                            
                            return app.everlive.Files.getDownloadUrl(imageId);
                        }
                    },                    
                },    
                filter: {
                    field: "Owner",
                    operator: "eq",
                    value: app.currentUser.Id
                },
                sort: { 
                    field: "CreatedAt", 
                    dir: "desc"
                },
                requestStart: function(e) {
                    app.common.showLoading();
                },                
                requestEnd: function(e) {
                    app.common.hideLoading();
                },
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,    
                pageSize: app.config.data.leafs.pageSize
            });
            
            this.viewModel.set("myPlantsDataSource", myPlantsDataSource);
        },
        
        refreshMyLeafsData: function (e) {
            var that = this,
                refresh = e.view.params.refresh;
            
            if(refresh) {
                that.viewModel.get("myPlantsDataSource").read();
            }
        },
        
        initMyLeafsData: function () {
            var that = this;
            
            app.common.showLoading();
            app.common.updateFilesInfo()
            .then($.proxy(that.setMyPlantsData, that));
        },
        
        initAllLeafsData: function () {
            var that = this;
            
            app.common.showLoading();
            app.common.updateFilesInfo()
            .then($.proxy(that.setAllUserPlantsData, that));
        },
        
        updatePlantsNamesList: function (allPlantsList) {
            this.userPlantsNamesList = $.map(allPlantsList, function (item) {
                if(item.Owner === app.currentUser.Id) {
                    return item.DiscoveredPlant;
                }
            });
        }
    });
    
    app.leafsService = new LeafsService();
})(window);
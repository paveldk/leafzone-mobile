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
            that.allUserPlantsDataSource = new kendo.data.DataSource({ pageSize: app.config.lists.leafs.pageSize });
            that.myPlantsDataSource = new kendo.data.DataSource({ pageSize: app.config.lists.leafs.pageSize });
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
        
        init: function () {
            var that = this;
            
            that.viewModel = new LeafsViewModel();
            that.initLeafsMineModule = $.proxy(that.initMyLeafsData, that);
            that.initLeafsAllModule = $.proxy(that.initAllLeafsData, that);
        },
        
        setAllUserPlantsData: function () {
            var allUserPlantsDataSource = new kendo.data.DataSource({
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
                    }
                },
                requestStart: function(e) {
                    app.common.showLoading();
                },                
                requestEnd: function(e) {
                    app.common.hideLoading();
                },
                serverPaging: true,
                pageSize: app.config.lists.leafs.pageSize
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
                    }
                },
                filter: {
                    field: "Owner",
                    operator: "eq",
                    value: app.currentUser.Id
                },
                requestStart: function(e) {
                    app.common.showLoading();
                },                
                requestEnd: function(e) {
                    app.common.hideLoading();
                },
                serverPaging: true,
                pageSize: app.config.lists.leafs.pageSize
            });
            
            this.viewModel.set("myPlantsDataSource", myPlantsDataSource);
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
        }
    });
    
    app.leafsService = new LeafsService();
})(window);
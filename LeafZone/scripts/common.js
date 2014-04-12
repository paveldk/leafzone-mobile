(function (global) {
    var app = global.app = global.app || {};
    
    app.images = app.imagesList || {};
    
    function notification(title, message) {
        navigator.notification.alert(message, function () { }, title, "OK");
    }
    
    function showLoading() {
        kendo.mobile.application.showLoading();
    }
    
    function hideLoading() {
        kendo.mobile.application.hideLoading();
    }
    
    function navigateToView(view) {
        kendo.mobile.application.navigate(view);
    }
    
    function resizeImage(url, targetWidth, targetHeight, crop) {
        var imageObj = new Image();
        
        imageObj.crossOrigin = "Anonymous";
        
        return new RSVP.Promise(function (resolve, reject) {
            imageObj.onload = function () {
                var context,
                    ratio,
                    imageData,
                    result,
                    width = imageObj.width,
                    height = imageObj.height,
                    widthOffset = 0,
                    heightOffset = 0,
                    canvas = document.createElement("canvas");
                
                if (width < height) {
                    ratio = targetHeight / height;
                } else {
                    ratio = targetWidth / width;
                }
                
                canvas.width = width * ratio;
                canvas.height = height * ratio;
                
                widthOffset = (canvas.width - targetWidth) / 2;
                heightOffset = (canvas.height - targetHeight) / 2;
                
                context = canvas.getContext("2d");
                context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
                
                
                if (crop) {
                    imageData = context.getImageData(widthOffset, heightOffset, targetWidth, targetHeight);
                    
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    context = canvas.getContext("2d");
                    context.putImageData(imageData, 0, 0);
                }
                
                result = canvas.toDataURL("image/jpeg");
                
                resolve(result);
            };
            
            imageObj.src = url;
        })
    }
    
    function extractImageData(imageData) {
        var prefix = "data:image/jpeg;base64,";
        
        return imageData.substr(prefix.length, imageData.length);
    }
    
    function getImageDataForBinding(imageData) {
        return "data:image/jpeg;base64," + imageData;
    }
    
    function getResizedImage(imageUrl) {
        return resizeImage(imageUrl, app.config.images.imageWidth, app.config.images.ImageHeight, false)
        .then($.proxy(extractImageData, this));
    }
    
    function getResizedTmbl(imageUrl) {
        return resizeImage(imageUrl,  app.config.images.tumbnailSize,  app.config.images.tumbnailSize, true)
        .then($.proxy(extractImageData, this));
    }
    
    function updateFilesInfo() {
        var q = new Everlive.Query();
        
        q.select("Filename", "Uri", "Id");
        
        return app.everlive.data("Files").get(q)
        .then(function (data) {
            var currentItem;
            
            app.images.idMap = {};
            app.images.nameMap = {};
            
            
            for (var i = 0; i < data.result.length; i++) {
                currentItem = data.result[i];
                
                app.images.idMap[currentItem.Id] = currentItem;
                app.images.nameMap[currentItem.Filename] = currentItem;
            }
            
            return data.result;
        });
    }	
    
    function getTumbnailIdByImageId(imageId) {
        var fileName,
            tumbnailName;
        
        if (!app.images.idMap[imageId]) {
            return imageId;
        }
        
        fileName = app.images.idMap[imageId].Filename,
            tumbnailName = app.config.images.tumbnailPrefix + fileName;
        
        if (!app.images.nameMap[tumbnailName]) {
            return imageId;
        }
        
        return app.images.nameMap[tumbnailName].Id;
    }
    
    function getUploadFileNames() {
        var fileName = app.currentUser.Id + "-" + Date.now();
        
        return {
            fileName: fileName,
            tmblName: app.config.images.tumbnailPrefix + fileName,
        };        
    }
    
    function getCurrentLocation () {
        return new RSVP.Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                function (position) { resolve(position); },
                function (error) { reject(error); },
                { timeout: 30000, enableHighAccuracy: true });
        });			
    }
    
    function getLocationInfo (locationsList) {
        var locationInfo,
            result = locationsList[0].formatted_address;
        
        for (var i = 0; i < locationsList.length; i++) {
            locationInfo = locationsList[i];
            
            if (locationInfo.types.indexOf("locality") >= 0) {
                result = locationInfo.formatted_address;
            }
        }
        
        return result;
    }
    
    function getLocationName (latitude, longitude) {
        return new RSVP.Promise(function (resolve, reject) {
            var that = this,
                geocoder = new google.maps.Geocoder(),
                latlng;
            
            if (!latitude || !longitude) {
                reject();
                return;
            }
            
            latlng = new google.maps.LatLng(latitude, longitude);
            
            geocoder.geocode({ "latLng": latlng }, function (results, status) {
                var locationInfo;
                
                if (status === google.maps.GeocoderStatus.OK) {
                    locationInfo = getLocationInfo(results);
                    resolve(locationInfo);
                } else {
                    reject();
                }
            });
        });
    }
    
    app.common = {
        notification: notification,
        showLoading: showLoading,
        hideLoading: hideLoading,
        navigateToView: navigateToView,
        getResizedImage: getResizedImage,
        getResizedTmbl: getResizedTmbl,
        getImageDataForBinding: getImageDataForBinding,
        updateFilesInfo: updateFilesInfo,
        getTumbnailIdByImageId: getTumbnailIdByImageId,
        getUploadFileNames: getUploadFileNames,
        getLocationName: getLocationName,
        getCurrentLocation: getCurrentLocation
    };
})(window);
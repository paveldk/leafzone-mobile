(function (global) {   
    var app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();
        
        new kendo.mobile.Application(document.body, { statusBarStyle: "black-translucent", skin: "ios7" });     
        
        app.everlive = new Everlive({
            apiKey: app.config.everlive.apiKey,
            scheme: app.config.everlive.scheme
        });
    }, false);
})(window);
(function (global) {   
    document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();        
        new kendo.mobile.Application(document.body, {  layout: "tabstrip-layout" });        
    }, false);
})(window);
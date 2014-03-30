(function (global) {
    var app = global.app = global.app || {};
    
    function notification(title, message){
        navigator.notification.alert(title, function () { }, message, "OK");
    }
    
    app.common = {        
        notification: notification
    };    
})(window);
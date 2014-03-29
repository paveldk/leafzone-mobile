(function (global) {
    var app = global.app = global.app || {};
    
    app.config = {        
        everlive: {
            apiKey: "woLBIbIHeu9aWBrb",
            scheme: "http"
        },        
        facebook: {
            appId: "",
            redirectUri: "https://www.facebook.com/connect/login_success.html",
            endpoint: "https://www.facebook.com/dialog/oauth"
        },        
        google: {
            clientId:"",
            redirectUri: "http://localhost",
            scope: "https://www.googleapis.com/auth/userinfo.profile",
            endpoint: "https://accounts.google.com/o/oauth2/auth"
        },        
        liveId: {
            clientId:"",
            redirectUri: "https://login.live.com/oauth20_desktop.srf"       
        }      
    };    
})(window);
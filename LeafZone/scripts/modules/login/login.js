(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};
    
    LoginViewModel = kendo.data.ObservableObject.extend({
        isInMistSimulator: location.host.indexOf("icenium.com") > -1,
        isLoggedIn: false,
        username: "",
        password: "",
        consts: {
            PROVIDER_DEFAULT: "default",
            PROVIDER_FACEBOOK: "facebook",
            PROVIDER_GOOGLE: "google",
            PROVIDER_LIVE_ID: "liveid",
        },
        
        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();
            
            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                                             function () { }, "Login failed", "OK");
                
                return;
            }
            
            that._onStartLogin(that.consts.PROVIDER_DEFAULT);
            
            return app.everlive.Users.login(username, password)
            .then($.proxy(that._onLogInSuccess, that, that.consts.PROVIDER_DEFAULT))
            .then(null, $.proxy(that._onLogInError, that, that.consts.PROVIDER_DEFAULT));
        },
        
        onLoginFacebook: function () {
            var that = this,
                facebookLoginProvider,
                facebookConfig = {
                    name: "Facebook",
                    loginMethodName: "loginWithFacebook",
                    responseType: "token",
                    accessType: "online",
                    scope: "email",
                    display: "touch",
                    endpoint: app.config.facebook.endpoint,
                    clientId: app.config.facebook.appId,
                    redirectUri: app.config.facebook.redirectUri
                };
            
            facebookLoginProvider = new app.IdentityProvider(facebookConfig);           
            that._onStartLogin(that.consts.PROVIDER_FACEBOOK);
            
            return facebookLoginProvider.getAccessToken(function (token) {
                app.everlive.Users.loginWithFacebook(token)
                .then($.proxy(that._onLogInSuccess, that, that.consts.PROVIDER_FACEBOOK))
                .then(null, $.proxy(that._onLogInError, that, that.consts.PROVIDER_FACEBOOK));
            });
        },
        
        onLoginGoogle: function () {
            var that = this,
                googleLoginProvider,
                googleConfig = {
                    name: "Google",
                    loginMethodName: "loginWithGoogle",
                    responseType: "token",
                    accessType: "online",
                    display: "touch",
                    clientId: app.config.google.clientId,
                    redirectUri: app.config.google.redirectUri,
                    scope: app.config.google.scope,
                    endpoint: app.config.google.endpoint
                };
            
            googleLoginProvider = new app.IdentityProvider(googleConfig);            
            that._onStartLogin(that.consts.PROVIDER_GOOGLE);
            
            return googleLoginProvider.getAccessToken(function (token) {
                app.everlive.Users.loginWithGoogle(token)
                .then($.proxy(that._onLogInSuccess, that, that.consts.PROVIDER_GOOGLE))
                .then(null, $.proxy(that._onLogInError, that, that.consts.PROVIDER_GOOGLE));
            });
        },
        
        onLoginLiveId: function () {
            var that = this,
                liveIdLoginProvider,
                liveIdConfig = {
                    name: "LiveID",
                    loginMethodName: "loginWithLiveID",
                    endpoint: "https://login.live.com/oauth20_authorize.srf",
                    responseType: "token",
                    clientId: app.config.liveId.clientId,
                    redirectUri: app.config.liveId.redirectUri,
                    scope: "wl.basic",
                    accessType: "online",
                    display: "touch"
                };
            
            liveIdLoginProvider = new app.IdentityProvider(liveIdConfig);
            that._onStartLogin(that.consts.PROVIDER_LIVE_ID);
            
            return liveIdLoginProvider.getAccessToken(function (token) {
                app.everlive.Users.loginWithLiveID(token)
                .then($.proxy(that._onLogInSuccess, that, that.consts.PROVIDER_LIVE_ID))
                .then(null, $.proxy(that._onLogInError, that, that.consts.PROVIDER_LIVE_ID));
            });
        },
        
        checkEnter: function (e) {
            var that = this;
            
            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
        
        _onStartLogin: function (provider) {
            kendo.mobile.application.showLoading();
        },
        
        _onLogInSuccess: function (provider) {
            kendo.mobile.application.hideLoading();
            navigator.notification.alert("success",
                                         function () { }, "Login success", "OK");
        },
        
        _onLogInError: function (e) {
            kendo.mobile.application.hideLoading();
            navigator.notification.alert("error",
                                         function () { }, "Login failed", "OK");
        }
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);
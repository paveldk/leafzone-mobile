(function (global) {
    var SignInViewModel,
        SignUpViewModel,
        app = global.app = global.app || {};
    
    SignInViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",
        consts: {
            MESSAGE_TITLE_SIGN_IN_ERROR: "Sign In Error",
            MESSAGE_EMPTY_FIELD: "Both fields are required",
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
                app.common.notification(that.consts.MESSAGE_TITLE_SIGN_IN_ERROR, that.consts.MESSAGE_EMPTY_FIELD);
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
            app.common.notification("success", "success");
        },
        
        _onLogInError: function (e) {
            kendo.mobile.application.hideLoading();
            app.common.notification("error", "error");           
        }
    });
    
    SignUpViewModel = kendo.data.ObservableObject.extend({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        consts: {
            MESSAGE_TITLE_SIGN_UP_ERROR: "Sign Up Error",
            MESSAGE_PASSWORD_DO_NOT_MATCH: "Passowrds do not match",
            MESSAGE_ALL_FIELDS_REQUIRED: "All fields are required"
        },
        
        onSignUp: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim(),
                confirmPassword = that.get("confirmPassword").trim(),
                email = that.get("email").trim(),
                fullName = that.get("fullName").trim();
            
            if(that.checkRequiredField("fullName") &&
               that.checkRequiredField("username") &&
               that.checkRequiredField("email") &&
               that.checkRequiredField("password") &&
               that.checkRequiredField("confirmPassword") &&
               that.checkPasword(password, confirmPassword)) {
                that._onStartLogin();                
                app.everlive.Users.register(username, password, {Email: email, DisplayName: fullName})
                .then($.proxy(that._onSignUpSuccess, that))
                .then(null, $.proxy(that._onSignUpError, that));
            }
        },
        
        checkEnter: function (e) {
            var that = this;
            
            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
        
        checkRequiredField: function (field) {
            var fieldValue = this.get(field).trim();
            
            if(!fieldValue){
                app.common.notification(that.consts.MESSAGE_TITLE_SIGN_UP_ERROR, that.consts.MESSAGE_ALL_FIELDS_REQUIRED);
                return false;
            }
            
            return true;
        },
        
        checkPasword: function (password, confirmPassword) {
            if(password !== confirmPassword){
                app.common.notification(that.consts.MESSAGE_TITLE_SIGN_UP_ERROR, that.consts.MESSAGE_PASSWORD_DO_NOT_MATCH);
                return false
            }
            
            return true;
        },
        
        _onStartSignUp: function () {
            kendo.mobile.application.showLoading();
        },
        
        _onSignUpSuccess: function (provider) {
            kendo.mobile.application.hideLoading();
            app.common.notification("success", "success");
        },
        
        _onSignUpError: function (e) {
            kendo.mobile.application.hideLoading();
            app.common.notification("error", "error");
        }
    });
    
    app.loginService = {
        signInViewModel: new SignInViewModel(),
        signUpViewModel: new SignUpViewModel()
    };
})(window);
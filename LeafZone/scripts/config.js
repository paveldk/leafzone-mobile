(function (global) {
    var app = global.app = global.app || {};

    app.config = {
        everlive: {
            //The original api key is woLBIbIHeu9aWBrb, because of accaunt level does not suppor social login. Use
            //ltG65jxbc26oEeod for social login test
            apiKey: "woLBIbIHeu9aWBrb",
            scheme: "http"
        },
        //TODO: create a new id
        facebook: {
            appId: "1408629486049918",
            redirectUri: "https://www.facebook.com/connect/login_success.html",
            endpoint: "https://www.facebook.com/dialog/oauth"
        },
        //TODO: create a new id
        google: {
            clientId: "406987471724-q1sorfhhcbulk6r5r317l482u9f62ti8.apps.googleusercontent.com",
            redirectUri: "http://localhost",
            scope: "https://www.googleapis.com/auth/userinfo.profile",
            endpoint: "https://accounts.google.com/o/oauth2/auth"
        },
        //TODO: create a new id
        liveId: {
            clientId: "000000004C10D1AF",
            redirectUri: "https://login.live.com/oauth20_desktop.srf"
        },
        views: {
            init: "#init-view",
            signIn: "scripts/modules/login/signin.html",
            signUp: "scripts/modules/login/signup.html",
            main: "scripts/modules/main/main.html",
            leafs: "scripts/modules/leafs/leafs.html",
            leafDetails: "scripts/modules/leafs/leaf-details.html",
            leafSubmit: "scripts/modules/leafs/leaf-submit.html",
            leafAnalyse: "scripts/modules/leafs/leaf-analyse.html",
            diseases: "scripts/modules/diseases/diseases.html",
            diseaseDetails: "scripts/modules/diseases/disease-details.html",
            plants: "scripts/modules/plants/plants.html",
            plantDetails: "scripts/modules/plants/plant-details.html"
        }
    };
})(window);
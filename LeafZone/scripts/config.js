(function (global) {
    var app = global.app = global.app || {};
    
    app.consts = {
        UNKNOWN_PLANT_NAME: "Unknown" ,
        UNKNOWN_DISEASE_NAME: "Unknown"
    };
    
    app.config = {
        everlive: {
            apiKey: "woLBIbIHeu9aWBrb",
            scheme: "http"
        },
        facebook: {
            appId: "1408629486049918",
            redirectUri: "https://www.facebook.com/connect/login_success.html",
            endpoint: "https://www.facebook.com/dialog/oauth"
        },
        google: {
            clientId: "406987471724-q1sorfhhcbulk6r5r317l482u9f62ti8.apps.googleusercontent.com",
            redirectUri: "http://localhost",
            scope: "https://www.googleapis.com/auth/userinfo.profile",
            endpoint: "https://accounts.google.com/o/oauth2/auth"
        },
        liveId: {
            clientId: "000000004C10D1AF",
            redirectUri: "https://login.live.com/oauth20_desktop.srf"
        },
        images: {
            tumbnailPrefix: "tmbl-",
            tumbnailSize: 72,
            imageWidth: 800,
            ImageHeight: 600
        },
        data: {
            plants: {
                pageSize: 40
            },
            diseases: {
                pageSize: 40
            },
            leafs: {
                pageSize: 40
            },
            aroundMe: {
                rangeKM: 50,
                topPlantsCount: 3,
                topDiseasesCount: 3
            }
        },
        views: {
            init: "#init-view",
            signIn: "scripts/modules/login/signin.html",
            signUp: "scripts/modules/login/signup.html",
            main: "scripts/modules/main/main.html",
            leafsAll: "scripts/modules/leafs/leafs-all.html",
            leafsMine: "scripts/modules/leafs/leafs-mine.html",
            leafDetails: "scripts/modules/leafs/leaf-details.html",
            leafSubmit: "scripts/modules/leafs/leaf-submit.html",
            leafAnalyse: "scripts/modules/leafs/leaf-analyse.html",
            leafAnalyseValidation: "scripts/modules/leafs/leaf-analyze-validation.html",
            diseases: "scripts/modules/diseases/diseases.html",
            diseaseDetails: "scripts/modules/diseases/disease-details.html",
            plants: "scripts/modules/plants/plants.html",
            plantDetails: "scripts/modules/plants/plant-details.html",
            aroundMe: "scripts/modules/profile/around-me.html",
            profile: "scripts/modules/profile/profile.html"
        }
    };
})(window);
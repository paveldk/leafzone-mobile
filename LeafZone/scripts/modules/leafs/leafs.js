(function (global) {
    var LoginBase,
        SignInViewModel,
        SignUpViewModel,
        app = global.app = global.app || {};
    
    LoginBase = kendo.data.ObservableObject.extend({
        inint: function(){
            return app.appReadyPromise
            .then( function(){
                return app.everlive.Users.login("svt", "svt");
            })
            .then( function(){
                return app.everlive.Users.currentUser();
            })
            
            .then(function(user){
                var data = app.everlive.data("UserPlants");       
                data.create({ 'Owner' : user.result.Id, 'CreatedBy' : user.result.Id },
                            function(data){
                                
                            },
                            function(error){
                                
                            });
                
                data.get()
                .then(
                    function(data){
                        
                    },            
                    function(error){
                        
                    });
            });
            
        }
        
    });
    
    return app.appReadyPromise
    .then( function(){
        debugger;
        return app.everlive.Users.login("svt", "svt");
    })
    .then( function(){
        return app.everlive.Users.currentUser();
    })    
    .then(function(user){
        var data = app.everlive.data("UserPlants");  
        var filter = new Everlive.Query();
        filter.where().eq('Owner', user.result.Id);
        
        data.get(filter)
        .then(
            function(data){
                
            },
            function(error){
                
            });    
    });
    
    
    
    
    app.leafsService = {
        
    };
    
})(window);
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {

  var blockModal;  

  if (api.getCurrentUser()) {
    const currentUser = api.getCurrentUser()

    var debug = currentUser.admin && settings.enable_debug_for_admins;
    var debugForUsers = settings.enable_debug_for_user_ids;
    var debugForIDs = (debugForUsers) ? debugForUsers.split("|") : null;
    if (debugForIDs && debugForIDs.includes(currentUser.id)) {
      debug = true;
    }
    var debug4All = settings.enable_debug_for_all;
    if(debug4All){ debug = true; }
    
    //const user = container.lookup("service:current-user");

    if(debug){          
      console.log('home-modal initializer:');
      //console.log(user);
      //console.log(currentUser.user_option);
      console.log('admin: ' + currentUser.admin); 
      console.log('id: ' + currentUser.id); 
    }

    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    blockModal = (showOnlyToAdmins && !isAdmin);

    if(!blockModal){
      api.registerConnectorClass("above-site-header", "home-modal", {
        shouldRender() {
          return true;
        },
      });
    
      api.createWidget("home-modal-widget", {
        tagName: "div.home-modal",
      });
    }

  }  

});


import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {

  api.registerConnectorClass("above-site-header", "home-modal", {
    shouldRender() {
      return true;
    },
  });

  api.createWidget("home-modal-widget", {
    tagName: "div.home-modal",
  });

  if (api.getCurrentUser()) {
    const currentUser = api.getCurrentUser()

    var debug = currentUser.admin && settings.enable_debug_for_admins;
    var debug4All = settings.enable_debug_for_all;
    if(debug4All){ debug = true; }
    
    //const user = container.lookup("service:current-user");

    if(debug){          
      console.log('initializer:');
      //console.log(user);
      //console.log(currentUser.user_option);
      //console.log(currentUser.admin); 
    }

    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    var blockModal = (showOnlyToAdmins && !isAdmin);
  }  

});


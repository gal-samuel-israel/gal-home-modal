import { apiInitializer } from "discourse/lib/api";
import homeModal from "../components/home-modal";

export default apiInitializer("1.6", (api) => {

    var blockModal;  

    const settingsOutlet = settings.plugin_outlet;

    if (api.getCurrentUser()) {
      const currentUser = api.getCurrentUser()

      var debug = currentUser.admin && settings.enable_debug_for_admins;
      var debugForUsers = settings.enable_debug_for_user_ids;
      var debugForIDs = (debugForUsers) ? debugForUsers.split("|") : null;
      if (debugForIDs && debugForIDs.includes(currentUser.id.toString())) {
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
        console.log('API version', api.version);
      }

      var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
      var isAdmin = (currentUser.admin)        
      blockModal = (showOnlyToAdmins && !isAdmin);

      if(!blockModal){
        
        api.renderInOutlet(settingsOutlet, homeModal); 
        
          api.addCommunitySectionLink({
            href: "https://portal.algosec.com/community/1st-step", //forwards to https://community.algosec.com/?force=1st-step
            name: "firstStep",
            //route: "",
            text: "First Step",
            //title: "First Step",
            //icon: "wrench", // without setting of icon the link icon will be used
          },false);
                    
      }

    }  

});


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

          /* TODO: #1
            DEPRECTAED !!!
            fix:
              move the home-modal.hbs into the /components/ folder to be with home-modal.js
              import Klass into this js (on top) like:
              import homeModal from "../components/home-modal ... "
              then replace the api.registerConnectorClass
              to : api.renderInOutlet(settingsOutlet, homeModal);
              make sure to define selectedOutlet from settings.yml

          api.registerConnectorClass("above-site-header", "home-modal", {
            shouldRender() {
              return true;
            },
          });
        
          api.createWidget("home-modal-widget", {
            tagName: "div.home-modal",
          });
          */

          //add hamburger custom link that will be used force the modal appearance 
          //console.log('testing api.decorateWidget'); 
          /*
          DEPRECATED. need to use: api.addCommunitySectionLink
          api.decorateWidget('hamburger-menu:generalLinks', (helper) => {
            //console.log('helper:', helper);                              
            return {
              href: "//?force=1st-step",  // is required to force a reload of home page if user is already in the home page 
              className: "first-step-link",
              rawLabel: "First Step",
              attributes: {
                action: (event)=>{ console.log('event', event);},
              },          
            }
          });      
          */
          api.addCommunitySectionLink({
            href: window.location.pathname + "?force=1st-step",
            name: "firstStep",
            //route: "all",
            text: "First Step",
            //title: "First Step",
            //icon: "wrench", // without setting of icon the link icon will be used
          },false);
      }

    }  

});


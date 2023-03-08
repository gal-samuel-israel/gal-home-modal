import { apiInitializer } from "discourse/lib/api";
import { defaultHomepage } from "discourse/lib/utilities";
import { mapRoutes } from "discourse/mapping-router";

export default apiInitializer("0.8", (api) => {

  var blockModal;  

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

      //add hamburger custom link that will activate the modal
      if(debug){
        //did not work // mapRoutes('firstStepModal', (params)=>{ console.log('shoot', params);});
        
        console.log('testing api.decorateWidget'); 
        api.decorateWidget('hamburger-menu:generalLinks', (helper) => {
          //console.log('click', helper);
          
          //helper.widget.appEvents.on("page:changed", (data) => {
          //  console.log('referrer:', document.referrer);
          //  if(data.url==='/?force=1st-step'){window.location.reload();}
          //});
          
          return {
            href: "https://community.algosec.com/?force=1st-step",
            //route: `discovery.${defaultHomepage()}`,
            //mapRoutes did not work//route: 'firstStepModal',
            //href: "",
            className: "first-step-link",
            rawLabel: "First Step",            
          }
        });

        api.attachWidgetAction('hamburger-menu:generalLinks','first-step-link-action',(element)=>{
          console.log('action', element);
        });
        
       /* NOT WORKING
        console.log('testing api.addCommunitySectionLink');
        api.addCommunitySectionLink(
          {
            name: "first-step-link",
            //route: "discovery.unread",
            title: "First Step Onboarding Wizard",
            text: "First Step"
            }
        );
        */
      }

    }

  }  

});


import { withPluginApi } from "discourse/lib/plugin-api";
import { startPageTracking } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';
import showGate from '../lib/custom-modal';

export default {
  name: "home-modal",
  after: 'inject-objects',

  initialize(container) {
    withPluginApi("0.8.31", api => {
      
      if (api.getCurrentUser()) {
        const currentUser = api.getCurrentUser()

        var debug = currentUser.admin && settings.enable_debug_for_admins;
        var debug4All = settings.enable_debug_for_all;
        if(debug4All){ debug = true; }
        
        if(debug){
          console.log(currentUser);       
          console.log(currentUser.id);
          console.log(currentUser.admin); 
        }

        var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
        var isAdmin = (currentUser.admin)        
        var blockModal = (showOnlyToAdmins && !isAdmin);

        /*
          $("body").on("click", "a.lightbox", function() {
            showGate('home-modal');
            $.magnificPopup.instance.close();
          });
        */

          var pageView = 0;
          // Tell our AJAX system to track a page transition
          const router = container.lookup('router:main');
          router.on('willTransition', viewTrackingRequired);

          let appEvents = container.lookup('service:app-events');
          startPageTracking(router, appEvents);
          
          appEvents.on('page:changed', data => {
            /*
            console.log(data);
            var urlPrefix = "/t/"; // NOTE: "/t/" is for topic "/c/" is for category
            var pattern = new RegExp('^' + urlPrefix);
            var hasPrefix = pattern.test(data.url);
            */ 
            
            var isHome = (window.location.pathname==='/') ? true:false;
            if(debug){
              console.log('url: ' + window.location.pathname + ' | isHome : '+ isHome);
            }        
            
            if(isHome && !blockModal) {              
                showGate('home-modal');
            }
          });
        
      } 
    });
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
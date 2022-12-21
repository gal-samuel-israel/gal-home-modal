import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";
import { cookAsync } from "discourse/lib/text";
import { setting } from 'discourse/lib/computed';
import showModal from "discourse/lib/show-modal";
//import getURL from "discourse-common/lib/get-url";
import { action } from "@ember/object";

export default Ember.Controller.extend(ModalFunctionality, {
  
  /* Object local params */
  debugForAdmins: null,
    
  newNameInput: null,
  newBioRawInput: null,

  hideModalNextTime: null,
  
  init() {
    this._super(...arguments);    
    this.debugForAdmins = setting("enable_debug_for_admins"); //from settings.yml
    
    this.saveAttrNames = [
      "name",
      "bio_raw",  
    ];
    //this.set("revoking", {});

    this.newNameInput = this.currentUser.name;        
    this.hideModalNextTime = JSON.parse(localStorage.getItem("homeModalHide"));

    /*
    ajax(`/u/${this.currentUser.username}.json`)
    .then((data) => {        
        //console.log(data);        
        this.currentUser.set("bio_raw", data.user.bio_raw); 
        this.currentUser.set("bio_cooked", data.user.bio_cooked); 
        this.currentUser.set("bio_excerpt", data.user.bio_excerpt); 

        this.newBioRawInput = this.currentUser.bio_raw;        
      }
    ).catch(popupAjaxError);
    */

    const data = ajax(`/u/${this.currentUser.username}.json`);
    console.log(data);
    this.currentUser.set("bio_raw", data._result.user.bio_raw); 
    this.currentUser.set("bio_cooked", data._result.user.bio_cooked); 
    this.currentUser.set("bio_excerpt", data._result.user.bio_excerpt); 

    this.newBioRawInput = this.currentUser.bio_raw; 

    /*
    cookAsync(this.currentUser.get("bio_raw"))
      .then((data) => {
        this.newBioRawInput = data;
        this.currentUser.set("bio_cooked");        
      })
      .catch(popupAjaxError);
    */

    if(this.debugForAdmins){
      console.log('extend init start:');
      //console.log(this);
      //console.log(arguments);
      console.log(this.currentUser);      
      console.log('extend init end:');
    }

  },

  /* actions for Avatar and name change */  
  @action
  showAvatarSelector(user) {
    showModal("avatar-selector").setProperties({ user });
  },
  @action
  saveUserInfo() {
    event?.preventDefault();
    this.set("saved", false);

    this.currentUser.setProperties({
      name: this.newNameInput,
      bio_raw: this.newBioRawInput,        
    });

    return this.currentUser
      .save(this.saveAttrNames)
      .then(() => {
        console.log('saved name');
        cookAsync(this.currentUser.get("bio_raw"))
            .then((cooked) => {
              this.currentUser.set("bio_cooked",cooked);
              this.set("saved", true);

              if(this.debugForAdmins){
                console.log(this.currentUser);
              }

            })
            .catch(popupAjaxError);
      })
      .catch(popupAjaxError);
  },
  @action
  testAction(event){
    event?.preventDefault();
    console.log('testAction');
    this.set("saved", true);
  },
 
  /* Hide Modal actions */
  @action
  toggleHideNextTime(event){
    event?.preventDefault();
    console.log('toggleHideNextTime:');
    console.log('was : ' + this.hideModalNextTime);
    this.set("hideModalNextTime", !this.hideModalNextTime);
    localStorage.setItem("homeModalHide", this.hideModalNextTime);
    console.log('now : ' + this.hideModalNextTime);
  },

  /* Test actions */
  @action
  showLogin(event) {    
    event?.preventDefault();
    console.log('action: showLogin');
    //showModal("login");
  },
    
  @action
  ssoLoginGate(event) {
    event?.preventDefault();
    console.log('action: ssoLoginGate');
    //const returnPath = encodeURIComponent(window.location.pathname);
    //window.location = getURL("/session/sso?return_path=" + returnPath);
  }

  /*  
  @action
  showCreateAccountGate(event) {
    event?.preventDefault();
    console.log('action: showCreateAccountGate');
    showModal("createAccount", {
      modalClass: "create-account",
    });
  },
  */
});

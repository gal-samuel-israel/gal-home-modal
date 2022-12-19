import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { popupAjaxError } from "discourse/lib/ajax-error";
import { setting } from 'discourse/lib/computed';
import { action } from "@ember/object";
import showModal from "discourse/lib/show-modal";
import getURL from "discourse-common/lib/get-url";

export default Ember.Controller.extend(ModalFunctionality, {
  /* Object local params */
  debugForAdmins: setting("enable_debug_for_admins"), //from settings.yml
  canEditName: setting("allow_user_to_edit_name"), //from settings.yml
  canSaveUser: true,
  newNameInput: null,
  hideModalNextTime: localStorage.getItem("homeModalHide"),

  init() {
    this._super(...arguments);
    this.saveAttrNames = [
      "name",      
    ];
    //this.set("revoking", {});

    this.newNameInput = this.currentUser.name;

    if(this.debugForAdmins){
      console.log(this);
      console.log(arguments);
    }
    
  },

  /* actions for Avatar and name change */  
  @action
  showAvatarSelector(user) {
    showModal("avatar-selector").setProperties({ user });
  },
  @action
  saveUserName() {
    event?.preventDefault();
    this.set("saved", false);
    this.currentUser.setProperties({
      name: this.newNameInput,        
    });
    return this.currentUser
      .save(this.saveAttrNames)
      .then(() => this.set("saved", true))
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

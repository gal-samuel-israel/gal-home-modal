import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { popupAjaxError } from "discourse/lib/ajax-error";
import { cookAsync } from "discourse/lib/text";
import { setting } from 'discourse/lib/computed';
import { action } from "@ember/object";
import showModal from "discourse/lib/show-modal";
import getURL from "discourse-common/lib/get-url";

export default Ember.Controller.extend(ModalFunctionality, {
  /* Object local params */
  debugForAdmins: null,
  canEditName: null,
  canSaveUser: true,
  newNameInput: null,
  newBioRawInput: null,
  hideModalNextTime: null,

  init() {
    this._super(...arguments);

    console.log('extend init start:');

    this.debugForAdmins = setting("enable_debug_for_admins"); //from settings.yml
    this.canEditName = setting("allow_user_to_edit_name"); //from settings.yml

    this.saveAttrNames = [
      "name",
      "bio_raw",  
    ];
    //this.set("revoking", {});

    this.newNameInput = this.currentUser.name;
    this.newBioRawInput = this.currentUser.userOption('bio_raw');

    if(this.debugForAdmins){
      console.log(this);
      console.log(arguments);
    }
    
    this.hideModalNextTime = JSON.parse(localStorage.getItem("homeModalHide"));

    console.log('extend init end:');   

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
      bio_raw: this.newBioRawInput,        
    });
    return this.currentUser
      .save(this.saveAttrNames)
      .then(() => {
        
        cookAsync(this.currentUser.get("bio_raw"))
            .then(() => {
              this.currentUser.set("bio_cooked");
              this.set("saved", true);
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

import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { setting } from 'discourse/lib/computed';
import { action } from "@ember/object";
import showModal from "discourse/lib/show-modal";
import getURL from "discourse-common/lib/get-url";

export default Ember.Controller.extend(ModalFunctionality, {

  init() {
    this._super(...arguments);
    this.saveAttrNames = [
      "name",      
    ];
    this.set("revoking", {});

    console.log(this);
    console.log(arguments);
  },

  /*
  params and actions for Avatar and name change
  */
  canEditName: setting("allow_user_to_edit_name"), //from settings.yml
  canSaveUser: true,
  newNameInput: null,
  @action
  showAvatarSelector(user) {
    showModal("avatar-selector").setProperties({ user });
  },
  actions: {
    testAction(){
      console.log('testAction');
    },
    saveUserName() {
      this.set("saved", false);
      this.currentUser.setProperties({
        name: this.newNameInput,        
      });
      return this.currentUser
        .save(this.saveAttrNames)
        .then(() => this.set("saved", true))
        .catch(popupAjaxError);
    },
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

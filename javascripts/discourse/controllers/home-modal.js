import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { setting } from 'discourse/lib/computed';
import { action } from "@ember/object";
import showModal from "discourse/lib/show-modal";
import getURL from "discourse-common/lib/get-url";

export default Ember.Controller.extend(ModalFunctionality, {

  //login: Ember.inject.controller(),

  //ssoEnabled: setting('enable_discourse_connect'),

  /*
  actions: {
    externalLogin(provider) {
      this.get('login').send('externalLogin', provider);
    }
  },
  */

  @action
  showAvatarSelector(user) {
    showModal("avatar-selector").setProperties({ user });
  },
  
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

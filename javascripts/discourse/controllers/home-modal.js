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
  debugFooter: false,
    
  newNameInput: null,
  newBioRawInput: null,
  newBioCooked: null,

  hideModalNextTime: null,

  currentStep1: null,
  currentStep2: null,
  currentStep3: null,
  currentStep4: null,
  
  init() {
    this._super(...arguments);

    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debugFooter = this.debugForAdmins && settings?.enable_modal_footer_internal_debug; //from settings.yml
    
    this.set("currentStep1", true);
    this.set("currentStep2", false);
    this.set("currentStep3", false);
    this.set("currentStep4", false);

    this.saveAttrNames = [
      "name",
      "bio_raw",  
      "bio_cooked", 
      "bio_excerpt",
    ];

    this.hideModalNextTime = JSON.parse(localStorage.getItem("homeModalHide"));

    /* prep the user bios */
    ajax(`/u/${this.currentUser.username}.json`)
    .then((data) => {        
        //console.log(data);        
        this.currentUser.set("bio_raw", data.user.bio_raw); 
        this.currentUser.set("bio_cooked", data.user.bio_cooked); 
        this.currentUser.set("bio_excerpt", data.user.bio_excerpt);                
      }).catch(popupAjaxError);
    
    if(this.debugForAdmins){
      console.log('init start:');
      console.log(this);
      //console.log(arguments);
      //console.log(this.currentUser);      
      console.log('init end:');
    }

  },

  /* next buttons handlers */
  @action
  handleStep1NextButton(event){
    event?.preventDefault();

    this.set("currentStep1", false);
    this.set("currentStep2", true);

    this.set("newNameInput", this.currentUser.name);
    this.set("newBioRawInput", this.currentUser.bio_raw);
    this.set("newBioCooked", this.currentUser.bio_cooked);

    let deditor = document.querySelector("textarea.d-editor-input");
    if(deditor !=='undefined'){
      deditor.value = this.get("currentUser.bio_raw");
    }
    let firedEvent = document.querySelector("textarea.d-editor-input").dispatchEvent(new Event('change'));
    if(this.debugForAdmins){
      console.log('updated d-editor-input: '+firedEvent);
    }
  },

  @action
  handleStep3NextButton(event){
    event?.preventDefault();
    this.set("currentStep3", false);
    this.set("currentStep4", true);
  },

  @action
  handleStep4FinishButton(event){
    event?.preventDefault();
    this.send("closeModal");
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
        if(this.debugForAdmins){
          console.log('user info saved');
        }
        this.set("saved", true);
        this.set("currentStep2", false);
        this.set("currentStep3", true);
      })
      .catch(popupAjaxError);
  },
  @action
  biosUpdate(event){
    event?.preventDefault();
    if(this.debugForAdmins){ 
      console.log('target value:');
      console.log(event.target.value);
      console.log('this.newBioRawInput:');
      console.log(this.newBioRawInput);
      console.log('this.currentUser.bio_raw:');
      console.log(this.currentUser.bio_raw);
    }    
  },
  @action
  testAction(event){
    event?.preventDefault();
    if(this.debugForAdmins){
      console.log('testAction');
      console.log(event);
    }
    //this.set("saved", true);
  },
 
  /* Hide Modal actions */
  @action
  toggleHideNextTime(event){
    event?.preventDefault();
    if(this.debugForAdmins){
      console.log('toggleHideNextTime:');
      console.log('was : ' + this.hideModalNextTime);
    }
    this.set("hideModalNextTime", !this.hideModalNextTime);
    localStorage.setItem("homeModalHide", this.hideModalNextTime);
    if(this.debugForAdmins){
      console.log('now : ' + this.hideModalNextTime);
    }
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

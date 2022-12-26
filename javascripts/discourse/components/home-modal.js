import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";
import { cookAsync } from "discourse/lib/text";
import { setting } from 'discourse/lib/computed';
import showModal from "discourse/lib/show-modal";
//import getURL from "discourse-common/lib/get-url";
import { action } from "@ember/object";

import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import { and } from "@ember/object/computed";
import discourseComputed, { observes } from "discourse-common/utils/decorators";

export default Component.extend({
  router: service(),
  tagName: "",

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

    console.log('X-init'); 

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

    //prep the user bios
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
  

  @discourseComputed("router.currentRouteName", "router.currentURL")
  showHere(currentRouteName, currentURL) {
    return currentRouteName == `discovery.${defaultHomepage()}`;    
  },

  @discourseComputed("currentUser")
  displayForUser(currentUser) { 
    /*
    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    var blockDisplay = (showOnlyToAdmins && !isAdmin);

    if (blockDisplay) {
      return false;
    } 
    */
    return true;
  },

  shouldDisplay: true, //and("displayForUser", "displayForRoute"),

  // Setting a class on <html> from a component is not great
  // but we need it for backwards compatibility
  @observes("shouldDisplay")
  displayChanged() {   
    document.documentElement.classList.toggle(
      "home-modal",
      this.shouldDisplay
    );    
  },

  didInsertElement() {      
    this._super(...arguments);

    console.log('X-didInsertElement');
             
    this.displayChanged();

  },

  didRender(){
    this._super(...arguments);

    console.log('X-didRender');
    if(this.debugForAdmins){
      console.log('didRender');
    }
  },

  didDestroyElement() {
    document.documentElement.classList.remove("home-modal");
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
    showModal("avatar-selector").setProperties({user});    
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
  testAction(event){
    event?.preventDefault();
    if(this.debugForAdmins){
      console.log('testAction');
      console.log(event);
    }
    //this.set("objVarX", true);
  },

});

import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";
import showModal from "discourse/lib/show-modal";
import { defaultHomepage } from "discourse/lib/utilities";
import discourseComputed, { observes, bind } from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { and, equal } from "@ember/object/computed";

export default Component.extend({
  router: service(),
  tagName: "",

  /* Object local params */
  
  debugForAdmins: null,
  debugFooter: false,
  debugFocusTrap: false,
  
  //email preferances checkboxes
  email_messages_level: true, 
  email_digests: true,

  //profile
  newNameInput: null,
  newBioRawInput: null,
  newBioCooked: null,

  //modal hide next time checkbox
  hideModalNextTime: null,

  showModalPop: null,

  
  currentStep1: null,
  currentStep2: null,
  currentStep3: null,
  currentStep4: null,

  currentFocusableElements: [],

  modalStateCheck(){
    this.set("hideModalNextTime", (JSON.parse(localStorage.getItem("homeModalHide"))));
    this.set("showModalPop", !this.hideModalNextTime && (this.router.currentRouteName === `discovery.${defaultHomepage()}`)); 
    if(this.debugForAdmins){
      console.log('modalStateCheck:');
      console.log('this.hideModalNextTime:' + this.hideModalNextTime);
      console.log('this.showModalPop:' + this.showModalPop);
    }
    //reset to step 1
    this.set("currentStep1", true);
    this.set("currentStep2", false);
    this.set("currentStep3", false);
    this.set("currentStep4", false);
  },

  init() {
    this._super(...arguments);

    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debugFooter = this.debugForAdmins && settings?.enable_modal_footer_internal_debug; //from settings.yml

    this.saveAttrNamesProfile = [
      "name",
      "bio_raw",  
      "bio_cooked", 
      "bio_excerpt",
    ];

    this.saveAttrNamesEmail = [
      "email_messages_level",
      "email_digests",
    ];

    this.modalStateCheck(); 

    //prep the user bios
    ajax(`/u/${this.currentUser.username}.json`)
    .then((data) => {        
        //console.log(data);        
        this.currentUser.set("bio_raw", data.user.bio_raw); 
        this.currentUser.set("bio_cooked", data.user.bio_cooked); 
        this.currentUser.set("bio_excerpt", data.user.bio_excerpt);                
      }).catch(popupAjaxError);
    
    if(this.debugForAdmins){
      console.log('component init start:');
      console.log(this);
      //console.log(this.router.currentRouteName);
      //console.log(this.currentUser);      
      console.log('init end:');
    }

  },
  
  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {  
    if(this.debugForAdmins){
      console.log('discourseComputed displayForRoute');
      console.log('currentRouteName: '+ currentRouteName);
      console.log('defaultHomepage: '+ defaultHomepage());
    }  
    return currentRouteName === `discovery.${defaultHomepage()}`;    
  },

  @discourseComputed("currentUser")
  displayForUser(currentUser) {         
    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    var blockDisplay = (showOnlyToAdmins && !isAdmin);

    if(this.debugForAdmins){
      console.log('discourseComputed displayForUser');
      console.log('blockDisplay: '+ blockDisplay);
    }

    return !blockDisplay;
  },

  shouldDisplay: and("displayForUser", "displayForRoute"), 
  
  @bind
  nodeListsAreEqual( list1, list2 ) {
    if ( list1.length !== list2.length ) {
        if(this.debugFocusTrap){      
          console.log('check: not same length');
        }
        return false;
    }
    var check = Array.from( list1 ).every( ( node, index ) => node === list2[ index ] );
    if(this.debugFocusTrap){      
      console.log('check: '+ check);
    }

    return Array.from( list1 ).every( ( node, index ) => node === list2[ index ] );
  },  
  
  @bind
  handleTabKeyStrokes(e) {

    if(this.debugFocusTrap){
      console.log('handleTabKeyStrokes element:');
      console.log(e);
    }    
    var KEYCODE_TAB = 9;
    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);
    if (!isTabPressed) { 
      return; 
    }

    if(this.debugFocusTrap){
      console.log('document.activeElement:');
      console.log(document.activeElement);
    }
    
    var arrFocusableElements = this.currentFocusableElements;
    var firstFocusableEl = arrFocusableElements[0];  
    var lastFocusableEl = arrFocusableElements[arrFocusableElements.length - 1];

    if(this.debugFocusTrap){
      console.log('Focusable count:' + arrFocusableElements.length);
      console.log('firstFocusableEl:');
      console.log(firstFocusableEl);
      console.log('lastFocusableEl:');
      console.log(lastFocusableEl);
    }

    if ( e.shiftKey )  { //shift + tab 
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
          e.preventDefault();
        }
      } else  { //tab 
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
          e.preventDefault();
        }
      }
      
  },
  
  //focus trap
  trapFocus(element) {
    var focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]');
    var newSet = false;
    if(!this.nodeListsAreEqual(this.currentFocusableElements, focusableEls)){
      this.set("currentFocusableElements", focusableEls);
      newSet = true;
    } 
          
    if(newSet){
      element.addEventListener("keydown", this.handleTabKeyStrokes, true);
      focusableEls[0].focus();

      if(this.debugFocusTrap){
        console.log('trapFocus: trap + focus on 1st item of:'); 
        console.log(this.currentFocusableElements);
      } 
    }
  },

  //Refresh the FocusTrap on steps change
  refreshTrapFocus(){
    var element = document.querySelector('#welcome-modal');
    if(element !== 'undefined' && this.shouldDisplay && this.showModalPop){
      this.trapFocus(element);      
    }
  },

  @observes("currentStep1", "currentStep2", "currentStep3", "currentStep4")
  stepUpdate(){
    if(this.debugForAdmins){
      console.log('stepUpdate');      
    }
    var element = document.querySelector('#welcome-modal');
    //var active = document.querySelector('#welcome-modal .progress-steps .active');
    var barNodes = document.querySelector('#welcome-modal .progress-steps');
    if(element !== 'undefined' && this.shouldDisplay && this.showModalPop){
      //active?.classList?.remove("active");
      if(this.currentStep1){
        barNodes?.children[0]?.classList.add("active");
      } else if (this.currentStep2) {
        barNodes?.children[1]?.classList.add("active");
      } else if (this.currentStep3) {
        barNodes?.children[2]?.classList.add("active");
      } else {
        barNodes?.children[3]?.classList.add("active");
      } 
           
    }
  },

  // Setting a class on <html> from a component is not great
  // but we need it for backwards compatibility
  @observes("shouldDisplay")
  displayChanged() { 

    if(this.debugForAdmins){
      console.log('displayChanged');
    }

    document.documentElement.classList.toggle(
      "home-modal",
      this.shouldDisplay
    );

    this.modalStateCheck();    

  },

  didInsertElement() {      
    this._super(...arguments);

    if(this.debugForAdmins){
      console.log('didInsertElement');      
    }

    this.displayChanged();
    this.refreshTrapFocus();              
  },

  didRender(){
    this._super(...arguments);

    //visual effects should not be done here as this is run many times
    if(this.debugForAdmins){
      console.log('didRender');      
    }    
    
    this.refreshTrapFocus();
    //this.progressBarUpdate();

  },

  willDestroyElement(element){
    if(this.debugForAdmins){
      console.log('willDestroyElement:');
      console.log(element);
    }  
    element.removeEventListener("keydown", this.handleTabKeyStrokes, true);

    this._super(...arguments);
  },

  didDestroyElement() {
    document.documentElement.classList.remove("home-modal");
  },
 

  /* next buttons handlers */
  @action
  handleStep1NextButton(event){
    event?.preventDefault();

    this.set("saved", false);

    this.currentUser.setProperties({
      email_messages_level: (this.email_messages_level) ? 0 : 2, //0 is always, 2 is never
      email_digests: this.email_digests,        
    });

    return this.currentUser
      .save(this.saveAttrNamesEmail)
      .then(() => {
        if(this.debugForAdmins){
          console.log('user email preferences saved');
        }
        this.set("saved", true);
        this.set("currentStep1", false);
        this.set("currentStep2", true);

        //prep user info in step 2
        this.set("newNameInput", this.currentUser.name);
        this.set("newBioRawInput", this.currentUser.bio_raw);
        this.set("newBioCooked", this.currentUser.bio_cooked); 
      })
      .catch(popupAjaxError);       
        
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
    this.set("showModalPop", false);
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
      .save(this.saveAttrNamesProfile)
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

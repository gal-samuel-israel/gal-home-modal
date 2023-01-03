import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";
import showModal from "discourse/lib/show-modal";
import { defaultHomepage } from "discourse/lib/utilities";
//import {addSaveableUserField, addSaveableUserOptionField } from "discourse/models/user";
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
  emailLevel: null, 
  emailDigests: null,

  //profile
  newNameInput: null,
  newBioRawInput: null,
  newBioCooked: null,

  //modal hide next time checkbox
  hideModalNextTime: null,

  showModalPop: null,

  destroying: false,
  
  currentStep1: null,
  currentStep2: null,
  currentStep3: null,
  currentStep4: null,

  currentFocusableElements: [],

  modalStateCheck(){
    this.set("hideModalNextTime", (JSON.parse(localStorage.getItem("homeModalHide"))));
    this.set("showModalPop", !this.hideModalNextTime && (this.router.currentRouteName === `discovery.${defaultHomepage()}`)); 
    if(this.debug){
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

    this.showOnlyToAdmins = settings?.enable_modal_only_for_admins; //from settings.yml
    this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
    this.debugFooter = this.debugForAdmins && settings?.enable_modal_footer_internal_debug; //from settings.yml
    this.debug4All = settings?.enable_debug_for_all; //from settings.yml    

    this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
    var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;
    
    this.debug = false;
    if(this.currentUser.admin && this.debugForAdmins){ this.debug = true; }
    if(debugForIDs && debugForIDs.includes(this.currentUser.id.toString())) { this.debug = true; }
    if(this.debug4All){ this.debug = true; }

    if(this.debug){
      console.log('component init start:');
    }


    if(!this.currentUser.admin && this.showOnlyToAdmins){
      if(this.debug){
        console.log('destroy');
      }
      this.destroying = true;
      this.destroy();
      return false;
    }


    this.saveAttrNamesProfile = [
      "name",
      "bio_raw",  
      "bio_cooked", 
      "bio_excerpt",
    ];

    this.saveAttrNamesEmail = [
      "email_level",
      "email_digests",
      "digest_after_minutes",
    ];    

    this.modalStateCheck(); 

    //get user json
    ajax(`/u/${this.currentUser.username}.json`)
    .then((data) => {        
        if(this.debug){     
          console.log('got user info:');
          console.log(data);        
        }
        //prep the user bios
        this.currentUser.set("bio_raw", data.user.bio_raw); 
        this.currentUser.set("bio_cooked", data.user.bio_cooked); 
        this.currentUser.set("bio_excerpt", data.user.bio_excerpt);

        //prep the user email prefs
        this.saveAttrNamesEmail.forEach((key)=>{
          this.currentUser.set(`user_option.${key}`, data.user.user_option[key]);
          if(this.debug){
            console.log(`user_option.${key}` + ': '+ data.user.user_option[key]);
          }
        });
        
        //prep email prefs
        this.set("emailLevel", data.user.user_option.email_level === 0 ? true : false);
        this.set("emailDigests", data.user.user_option.email_digests);     

        //is user an algosec employee ? (if so - set his custom_fields[1])
        var arrGroups = data.user.groups;
        var isEmployee;
        if(arrGroups?.length > 2){
          isEmployee = arrGroups.some((item)=>{
            return item.name === 'Algosec';
          });         
        }

        if(this.debug){     
          console.log('user info updated:');
          console.log(this.currentUser);
          console.log('isEmployee: ' + isEmployee);
          console.log('init ajax end');
        }

      }).catch(popupAjaxError);      
      
  },  
  
  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {  
    if(this.debug){
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

    if(this.debug){
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
    if(this.debug){
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

    if(this.debug){
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

    if(this.destroying){return;}

    if(this.debug){
      console.log('didInsertElement');      
    }

    this.displayChanged();
    this.refreshTrapFocus();              
  },

  didRender(){
    this._super(...arguments);

    if(this.destroying){return;}
    
    //visual effects should not be done here as this is run many times
    if(this.debug){
      console.log('didRender');      
    }    
    
    this.refreshTrapFocus();
    //this.progressBarUpdate();

  },

  willDestroyElement(element){
    if(this.debug){
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

    //prep user info in step 2
    this.set("newNameInput", this.currentUser.name);
    this.set("newBioRawInput", this.currentUser.bio_raw);
    this.set("newBioCooked", this.currentUser.bio_cooked); 

    this.set("currentStep1", false);
    this.set("currentStep2", true);        
        
  },

  @action
  handleStep3NextButton(event){
    event?.preventDefault();

    this.set("saved", false);
    
    this.currentUser.setProperties({
      'user_option.email_level': (this.emailLevel) ? 0 : 2, //0 is always, 2 is never
      'user_option.email_digests': this.emailDigests,
      'user_option.digest_after_minutes': 10080, //weekly
    });

    return this.currentUser
      .save(this.saveAttrNamesEmail)
      .then(() => {
        if(this.debug){
          console.log('user email preferences saved');
        }
        this.set("saved", true);
        this.set("currentStep3", false);
        this.set("currentStep4", true);
        
      })
      .catch(popupAjaxError);
    
  },

  @action
  handleStep4FinishButton(event){
    event?.preventDefault();
    this.set("showModalPop", false);
  },

  @action
  navigateToProfile(event){
    event?.preventDefault();
    window.location = `/u/${this.currentUser.username}/preferences/profile`;
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
        if(this.debug){
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
    if(this.debug){ 
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
    if(this.debug){
      console.log('toggleHideNextTime:');
      console.log('was : ' + this.hideModalNextTime);
    }
    this.set("hideModalNextTime", !this.hideModalNextTime);
    localStorage.setItem("homeModalHide", this.hideModalNextTime);
    if(this.debug){
      console.log('now : ' + this.hideModalNextTime);
    }
  },

  /* Test actions */
  @action
  testAction(event){
    event?.preventDefault();
    if(this.debug){
      console.log('testAction');
      console.log(event);
    }
    //this.set("objVarX", true);
  },

});

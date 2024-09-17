import { popupAjaxError } from "discourse/lib/ajax-error";
import { ajax } from "discourse/lib/ajax";
import showModal from "discourse/lib/show-modal";
import { defaultHomepage } from "discourse/lib/utilities";
import Mobile from "discourse/lib/mobile";
import User from "discourse/models/user";
import discourseComputed, { bind } from "discourse-common/utils/decorators";
import { observes } from"@ember-decorators/object";
//bad//import { bind } from "@ember-decorators/object/computed";
import { action } from "@ember/object";
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { and, equal } from "@ember/object/computed";
import { tracked } from "@glimmer/tracking";
import { isEmpty } from "@ember/utils";

//2408 - new avatar editor
import AvatarSelectorModal from "discourse/components/modal/avatar-selector";

const xMD5=function($){function _($,_){return $<<_|$>>>32-_}function x($,_){var x,r,F,n,C;return(F=2147483648&$,n=2147483648&_,x=1073741824&$,r=1073741824&_,C=(1073741823&$)+(1073741823&_),x&r)?2147483648^C^F^n:x|r?1073741824&C?3221225472^C^F^n:1073741824^C^F^n:C^F^n}function r($,_,x){return $&_|~$&x}function F($,_,x){return $&x|_&~x}function n($,_,x){return $^_^x}function C($,_,x){return _^($|~x)}function t($,r,F,n,C,t,A){var D,E,o;return $=x($,x(x((D=r,E=F,D&E|~D&(o=n)),C),A)),x(_($,t),r)}function A($,r,F,n,C,t,A){var D,E,o;return $=x($,x(x((D=r,E=F,D&(o=n)|E&~o),C),A)),x(_($,t),r)}function D($,r,F,n,C,t,A){var D,E,o;return $=x($,x(x((D=r,E=F,D^E^(o=n)),C),A)),x(_($,t),r)}function E($,r,F,n,C,t,A){var D,E,o;return $=x($,x(x((D=r,E=F,E^(D|~(o=n))),C),A)),x(_($,t),r)}function o($){var _,x,r="",F="";for(x=0;x<=3;x++)r+=(F="0"+(_=$>>>8*x&255).toString(16)).substr(F.length-2,2);return r}var e,B,u,f,a,c,i,h,v,d=[];for(e=0,d=function $(_){for(var x,r=_.length,F=r+8,n=((F-F%64)/64+1)*16,C=Array(n-1),t=0,A=0;A<r;)x=(A-A%4)/4,t=A%4*8,C[x]=C[x]|_.charCodeAt(A)<<t,A++;return x=(A-A%4)/4,t=A%4*8,C[x]=C[x]|128<<t,C[n-2]=r<<3,C[n-1]=r>>>29,C}($=function $(_){_=_.replace(/\r\n/g,"\n");for(var x="",r=0;r<_.length;r++){var F=_.charCodeAt(r);F<128?x+=String.fromCharCode(F):F>127&&F<2048?(x+=String.fromCharCode(F>>6|192),x+=String.fromCharCode(63&F|128)):(x+=String.fromCharCode(F>>12|224),x+=String.fromCharCode(F>>6&63|128),x+=String.fromCharCode(63&F|128))}return x}($)),c=1732584193,i=4023233417,h=2562383102,v=271733878;e<d.length;e+=16)B=c,u=i,f=h,a=v,c=t(c,i,h,v,d[e+0],7,3614090360),v=t(v,c,i,h,d[e+1],12,3905402710),h=t(h,v,c,i,d[e+2],17,606105819),i=t(i,h,v,c,d[e+3],22,3250441966),c=t(c,i,h,v,d[e+4],7,4118548399),v=t(v,c,i,h,d[e+5],12,1200080426),h=t(h,v,c,i,d[e+6],17,2821735955),i=t(i,h,v,c,d[e+7],22,4249261313),c=t(c,i,h,v,d[e+8],7,1770035416),v=t(v,c,i,h,d[e+9],12,2336552879),h=t(h,v,c,i,d[e+10],17,4294925233),i=t(i,h,v,c,d[e+11],22,2304563134),c=t(c,i,h,v,d[e+12],7,1804603682),v=t(v,c,i,h,d[e+13],12,4254626195),h=t(h,v,c,i,d[e+14],17,2792965006),i=t(i,h,v,c,d[e+15],22,1236535329),c=A(c,i,h,v,d[e+1],5,4129170786),v=A(v,c,i,h,d[e+6],9,3225465664),h=A(h,v,c,i,d[e+11],14,643717713),i=A(i,h,v,c,d[e+0],20,3921069994),c=A(c,i,h,v,d[e+5],5,3593408605),v=A(v,c,i,h,d[e+10],9,38016083),h=A(h,v,c,i,d[e+15],14,3634488961),i=A(i,h,v,c,d[e+4],20,3889429448),c=A(c,i,h,v,d[e+9],5,568446438),v=A(v,c,i,h,d[e+14],9,3275163606),h=A(h,v,c,i,d[e+3],14,4107603335),i=A(i,h,v,c,d[e+8],20,1163531501),c=A(c,i,h,v,d[e+13],5,2850285829),v=A(v,c,i,h,d[e+2],9,4243563512),h=A(h,v,c,i,d[e+7],14,1735328473),i=A(i,h,v,c,d[e+12],20,2368359562),c=D(c,i,h,v,d[e+5],4,4294588738),v=D(v,c,i,h,d[e+8],11,2272392833),h=D(h,v,c,i,d[e+11],16,1839030562),i=D(i,h,v,c,d[e+14],23,4259657740),c=D(c,i,h,v,d[e+1],4,2763975236),v=D(v,c,i,h,d[e+4],11,1272893353),h=D(h,v,c,i,d[e+7],16,4139469664),i=D(i,h,v,c,d[e+10],23,3200236656),c=D(c,i,h,v,d[e+13],4,681279174),v=D(v,c,i,h,d[e+0],11,3936430074),h=D(h,v,c,i,d[e+3],16,3572445317),i=D(i,h,v,c,d[e+6],23,76029189),c=D(c,i,h,v,d[e+9],4,3654602809),v=D(v,c,i,h,d[e+12],11,3873151461),h=D(h,v,c,i,d[e+15],16,530742520),i=D(i,h,v,c,d[e+2],23,3299628645),c=E(c,i,h,v,d[e+0],6,4096336452),v=E(v,c,i,h,d[e+7],10,1126891415),h=E(h,v,c,i,d[e+14],15,2878612391),i=E(i,h,v,c,d[e+5],21,4237533241),c=E(c,i,h,v,d[e+12],6,1700485571),v=E(v,c,i,h,d[e+3],10,2399980690),h=E(h,v,c,i,d[e+10],15,4293915773),i=E(i,h,v,c,d[e+1],21,2240044497),c=E(c,i,h,v,d[e+8],6,1873313359),v=E(v,c,i,h,d[e+15],10,4264355552),h=E(h,v,c,i,d[e+6],15,2734768916),i=E(i,h,v,c,d[e+13],21,1309151649),c=E(c,i,h,v,d[e+4],6,4149444226),v=E(v,c,i,h,d[e+11],10,3174756917),h=E(h,v,c,i,d[e+2],15,718787259),i=E(i,h,v,c,d[e+9],21,3951481745),c=x(c,B),i=x(i,u),h=x(h,f),v=x(v,a);return(o(c)+o(i)+o(h)+o(v)).toLowerCase()};

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

  //username , full name, avatar, bio
  @tracked newUsername: null,
  siteSettings: service(),
  dialog: service(),
  @tracked userNameEditing: null,
  @tracked errorMessage: null,
  @tracked saving: false,
  @tracked userNameTaken:false,

  //2408 - new avatar editor
  modal: service(),

  minUsernameLength: 9,
  maxUsernameLength: 50, 

  //user full name (optional)
  newNameInput: null,
  newBioRawInput: null,
  newBioCooked: null,

  //modal hide next time checkbox
  showHideThisBox: true, //enable disable the checkbox visibility
  hideModalNextTime: null,

  showModalPop: null,

  //The optional Banner
  showPopupBanner:null,
  bannerImageUrl: null,
  bannerAltText: null,
  bannerLink: null, 

  //force Modal
  @tracked shouldForce:false, 

  destroying: false,
  
  currentStep1: null,
  currentStep2: null,
  currentStep3: null,
  currentStep4: null,

  //step 3 email notifications checkbox
  showEmailNotificationsCheckBox: null,

  currentFocusableElements: [],

  modalStateCheck(){
    this.set("hideModalNextTime", (JSON.parse(localStorage.getItem("homeModalHide"))));    
    this.set("showModalPop", this.shouldForce || (!this.hideModalNextTime && (this.router.currentRouteName === `discovery.${defaultHomepage()}`)));
    this.updateBannerDetails();    

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
    if(this.currentUser?.admin && this.debugForAdmins){ this.debug = true; }
    if(debugForIDs && debugForIDs.includes(this.currentUser.id.toString())) { this.debug = true; }
    if(this.debug4All){ this.debug = true; }

    if(this.debug){
      console.log('component init start:');      
    }


    if(!this.currentUser || (!this.currentUser?.admin && this.showOnlyToAdmins)){
      if(this.debug){
        console.log('destroy');
      }
      this.destroying = true;
      this.destroy();
      return false;
    }

    this.showEmailNotificationsCheckBox = settings?.enable_email_notifications_check_box;

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
    ajax(`/u/${this.currentUser?.username}.json`)
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
        if(this.showEmailNotificationsCheckBox){
          this.set("emailLevel", data.user.user_option.email_level === 0 ? true : false);
        }
        this.set("emailDigests", data.user.user_option.email_digests);             

        this.currentUser.set("can_edit_username", true); 

        //jump to step2 if avatar on storage is not the avatar of user
        var storedCPI = localStorage.getItem("homeModalCPI");
        var userCPI = xMD5(this.currentUser.avatar_template);
        if(storedCPI && userCPI!= storedCPI){
          //reset to step 2
          this.handleStep1NextButton();     
        }

        //the current profile image:
        localStorage.setItem("homeModalCPI", xMD5(data.user.avatar_template));

        if(this.debug){     
          console.log('user info:');
          console.log(this.currentUser);          
          console.log('init ajax end');
        }

      }).catch(popupAjaxError);      
      
  },  
  
  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {  
    if(this.debug){
      console.log('discourseComputed displayForRoute');
      console.log('currentRouteName: '+ currentRouteName);
      //console.log('defaultHomepage: '+ defaultHomepage());
      console.log('Mobile.isMobileDevice:', Mobile.isMobileDevice);
      console.log('Mobile.mobileView:', Mobile.mobileView);
    }  
    var isMobile = (Mobile.isMobileDevice || Mobile.mobileView);
    var homeRoute = `discovery.${defaultHomepage()}`;    

    //force modal on home + query param force=1st-step
    const urlParams = new URLSearchParams(window.location.search);
    this.set("shouldForce", (urlParams.get('force') === '1st-step'));    

    return !isMobile && (this.shouldForce || (currentRouteName === homeRoute));    
  },

  @discourseComputed("currentUser")
  displayForUser(currentUser) {         
    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser?.admin)        
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
        if(this.debugFocusTrap){ console.log('check: not same length'); }
        return false;
    }
    var check = Array.from( list1 ).every( ( node, index ) => node === list2[ index ] );
    if(this.debugFocusTrap){ console.log('check: '+ check); }

    return Array.from( list1 ).every( ( node, index ) => node === list2[ index ] );
  },  
  
  @bind
  handleTabKeyStrokes(e) {

    if(this.debugFocusTrap){ console.log('handleTabKeyStrokes element:', e); }    
    var KEYCODE_TAB = 9;
    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);
    if (!isTabPressed) { return; }

    if(this.debugFocusTrap){ console.log('document.activeElement:', document.activeElement); }
    
    var arrFocusableElements = this.currentFocusableElements;
    var firstFocusableEl = arrFocusableElements[0];  
    var lastFocusableEl = arrFocusableElements[arrFocusableElements.length - 1];

    if(this.debugFocusTrap){
      console.log('Focusable count:' + arrFocusableElements.length);
      console.log('firstFocusableEl:', firstFocusableEl);
      console.log('lastFocusableEl:', lastFocusableEl);
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
      if(this.debugFocusTrap){ console.log('trapFocus: trap + focus on 1st item of:', this.currentFocusableElements); } 
    }
  },

  //Refresh the FocusTrap on steps change
  refreshTrapFocus(){
    var element = document.querySelector('#welcome-modal');
    if((element !== 'undefined' && element !== null) && this.shouldDisplay && this.showModalPop){
      this.trapFocus(element);      
    }
  },

  @observes("currentStep1", "currentStep2", "currentStep3", "currentStep4")
  stepUpdate(){
    if(this.debug){ console.log('stepUpdate'); }
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
    if(this.debug){ console.log('displayChanged'); }
    document.documentElement.classList.toggle(
      "home-modal",
      this.shouldDisplay
    );
    this.modalStateCheck();  
  },  

  modalSelector: '#welcome-modal.custom-home-modal .modal-pop',

  // Method to handle the ESC key press
  handleKeyDown(event) {
    if (this.showModalPop){return;} //DO NOT Allow To Close Setup Modal
    if (event.key === 'Escape') {
      this.closeModal(); 
    }
  },

  // Method to handle clicking outside the modal
  handleClickOutside(event) {
    if (this.showModalPop){return;} //DO NOT Allow To Close Setup Modal
    let modal = document.querySelector(this.modalSelector);
    if (modal && !modal.contains(event.target)) {
      this.closeModal(); 
    }
  },

  // Method to close the modal (add your actual logic here)
  closeModal() {
    // Your logic to close the modal
    this.set("showModalPop", false);
    this.set("showPopupBanner", false);
    if(this.debug){console.log('Modal closed');}
  },

  updateBannerDetails() {
    if(this.debug){  console.log('updateBannerDetails'); }
    this.set("showPopupBanner", !this.showModalPop);
    // Retrieve banner settings from the component or service
    this.set('bannerImageUrl', settings.optional_banner_file || null);
    this.set('bannerAltText', settings.optional_banner_alt || '');
    this.set('bannerLink', settings.optional_banner_link || '');        

    if(this.debug){
      console.log('bannerImageUrl:', this.bannerImageUrl);
      console.log('bannerAltText:', this.bannerAltText);
      console.log('bannerLink:', this.bannerLink);
    }
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if(this.debug){ console.log('didReceiveAttrs'); }
  },
  
  didInsertElement() {      
    this._super(...arguments);

    if(this.destroying){return;}
    if(this.debug){ 
      console.log('didInsertElement');      
    }

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('click', this.handleClickOutside.bind(this));    
    
    this.displayChanged();
    this.refreshTrapFocus();   
  },

  _closeModalListener: null,  // Context helper
  _listenerAdded: false,      // Flag to prevent multiple event listeners
  didRender(){
    this._super(...arguments);

    if(this.destroying){return;}
    
    //visual effects should not be done here as this is run many times
    if(this.debug){ console.log('didRender'); }    
    
    this.refreshTrapFocus();
    //this.progressBarUpdate();

    let closeButton = document.querySelector('.modal-banner-container .modal-pop .close-btn');
    //let closeButton = this.element.querySelector('.close-btn')
    if (closeButton && !this._listenerAdded) {            
      if(this.debug){ console.log('didRender: close button found');}
      // Bind the function and ensure proper context
      this._closeModalListener = this.closeModal.bind(this);
      closeButton.addEventListener('click', this._closeModalListener);
      this._listenerAdded = true;
    }

  },

  willRender() {
    if(this.debug){ console.log('willRender'); }   
  },

  willDestroyElement(element){
    if(this.debug){ console.log('willDestroyElement:', element); }  
    element.removeEventListener("keydown", this.handleTabKeyStrokes, true);

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    
    const closeButton = this.element.querySelector('.modal-banner-container .modal-pop .close-btn');
    if (closeButton && this._closeModalListener) {
      closeButton.removeEventListener('click', this._closeModalListener);
    }

    this._super(...arguments);
  },

  didDestroyElement() {
    document.documentElement.classList.remove("home-modal");
  },
 
 
  /* next buttons handlers */
  @action
  handleStep1NextButton(event){
    event?.preventDefault();

    //agree in step 1 is now acting as the checkbox:
    if(!this.debug){localStorage.setItem("homeModalHide", true);}

    //prep user info in step 2
    this.set("newUsername", this.currentUser.username);
    this.set("userNameEditing", false);

    this.set("newNameInput", this.currentUser.name);
    this.set("newBioRawInput", this.currentUser.bio_raw);
    this.set("newBioCooked", this.currentUser.bio_cooked); 

    this.set("currentStep1", false);
    this.set("currentStep2", true);        
        
  },
  
  @action
  toggleUsernameEditing() {    
    this.set("userNameEditing", !this.userNameEditing);

    this.set("newUsername", this.currentUser.username);
    this.set("errorMessage", null);
    this.set("saving", false);
    this.set("userNameTaken", false);

    if(this.debug){
      console.log('toggleUsernameEditing:');
      console.log('userNameEditing: '+this.userNameEditing);
    }  

  },

  @action
  async onUsernameInput(event) {
    event?.preventDefault();
    this.newUsername = event.target.value;
    this.userNameTaken = false;
    this.errorMessage = null;

    if (isEmpty(this.newUsername)) {
      return;
    }

    if (this.newUsername === this.currentUser.username) {
      return;
    }

    if (this.newUsername.length < this.minUsernameLength) {
      this.errorMessage = "User name too short";
      return;
    }

    const result = await User.checkUsername(
      this.newUsername,
      undefined,
      this.currentUser.id
    );

    if (result.errors) {
      this.set("errorMessage" , result.errors.join(" "));
    } else if (result.available === false) {
      this.set("userNameTaken",true);
    }
  },


    /*
      in
      https://community.algosec.com/admin/site_settings/category/users
      username chaning is limited by days.
      username change period : was set from 3 to 30

    */

  @action
  changeUsername(event) {
    event?.preventDefault();
    return this.dialog.yesNoConfirm({
      title: "Are you absolutely sure you want to change your username?",
      didConfirm: async () => {
        this.set("saving", true);

        try {
          await this.currentUser.changeUsername(this.newUsername);
            
          if(this.debug){
            console.log('username saved: '+ this.newUsername.toLowerCase());
          }          
          this.currentUser.setProperties({
            username: this.newUsername.toLowerCase(),
          });
        } catch (e) {
          popupAjaxError(e);
        } finally {
          this.set("saving", false);
          this.toggleUsernameEditing();
        }
        
      },
    });
  },

  @action
  handleStep3NextButton(event){
    event?.preventDefault();

    this.set("saved", false);
    
    this.currentUser.setProperties({     
      'user_option.email_digests': this.emailDigests,
      'user_option.digest_after_minutes': 10080, //weekly
    });

    if(this.showEmailNotificationsCheckBox){
      this.currentUser.setProperties({
        'user_option.email_level': (this.emailLevel) ? 0 : 2, //0 is always, 2 is never        
      });
    }

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
    this.closeModal();
    //this.set("showModalPop", false);
    //this.set("showPopupBanner", false);
  },

  @action
  navigateToProfile(event){
    event?.preventDefault();
    window.location = `/u/${this.currentUser.username}/preferences/profile`;
  },

  /* actions for Avatar and name change */  
  @action
  showAvatarSelector(user) {
    //2408 - DEPRECATED since v3.1 //showModal("avatar-selector").setProperties({user});  
    this.modal.show(AvatarSelectorModal, {
      model: { user },
    });  
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

  @action
  openNewTopicLink(event){
    event?.preventDefault();
    window.open('/new-topic?category=ask-the-community', '_blank');    
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

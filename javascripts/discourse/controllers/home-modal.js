import ModalFunctionality from 'discourse/mixins/modal-functionality';
import { popupAjaxError } from "discourse/lib/ajax-error";
import { cookAsync } from "discourse/lib/text";
import { setting } from 'discourse/lib/computed';
import showModal from "discourse/lib/show-modal";
import discourseComputed from "discourse-common/utils/decorators";
import getURL from "discourse-common/lib/get-url";
import { action } from "@ember/object";
import { readOnly } from "@ember/object/computed";

export default Ember.Controller.extend(ModalFunctionality, {
  /* Object local params */
  debugForAdmins: null,
  canEditName: null,
  canSaveUser: true,
  newNameInput: null,
  newBioRawInput: null,
  hideModalNextTime: null,
  canChangeBio: readOnly("model.can_change_bio"),

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
    this.newBioRawInput = this.currentUser.get("bio_raw");

    if(this.debugForAdmins){
      console.log(this);
      console.log(arguments);
    }
    
    this.hideModalNextTime = JSON.parse(localStorage.getItem("homeModalHide"));

    console.log('extend init end:');   

  },

  @discourseComputed("model.user_fields.@each.value")
  userFields() {
    let siteUserFields = this.site.user_fields;
    if (isEmpty(siteUserFields)) {
      return;
    }

    // Staff can edit fields that are not `editable`
    if (!this.currentUser.staff) {
      siteUserFields = siteUserFields.filterBy("editable", true);
    }

    return siteUserFields.sortBy("position").map((field) => {
      const value = this.model.user_fields?.[field.id.toString()];
      return EmberObject.create({ field, value });
    });
  },

  /* actions for Avatar and name change */  
  @action
  showAvatarSelector(user) {
    showModal("avatar-selector").setProperties({ user });
  },

  _updateUserFields() {
    const model = this.currentUser,
      userFields = this.userFields;

      console.log('in _updateUserFields:');
      console.log(userFields);
      
    if (!isEmpty(userFields)) {
      const modelFields = model.get("user_fields");
      if (!isEmpty(modelFields)) {
        userFields.forEach(function (uf) {
          const value = uf.get("value");
          modelFields[uf.get("field.id").toString()] = isEmpty(value)
            ? null
            : value;
        });
      }
    }
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
        console.log('saved name');
        cookAsync(this.newBioRawInput)
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

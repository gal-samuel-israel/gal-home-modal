import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";

export default class Steps extends Component {
  @tracked steps = [];

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;
    var stepsArray = [];

    /*
    ajax(`/directory_items.json?period=yearly&order=likes_received`).then(
      (data) => {
        this.topContributors = data.directory_items.slice(0, count);
      }
    );
    */  

    if (getOwner(this).hasRegistration(`component:steps`)) {
      console.log('hasRegistration');
      stepsArray = [{id:'step-1',content:'<p>Step 1</p>'},{id:'step-2',content:'<p>Step 2</p>'}];

    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `The component was not found`
      );
    }

    this.steps = stepsArray;

  };

  
  

  willDestroy() {
    this.steps = null;
  }
}

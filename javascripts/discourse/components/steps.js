import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

export default class Steps extends Component {
  @tracked steps = [];

  constructor() {
    super(...arguments);

    const count = this.args?.params?.count || 5;

    /*
    ajax(`/directory_items.json?period=yearly&order=likes_received`).then(
      (data) => {
        this.topContributors = data.directory_items.slice(0, count);
      }
    );
    */

    this.steps = [{id:'step-1',content:'<p>Step 1</p>'},{id:'step-2',content:'<p>Step 2</p>'}]
  }

  willDestroy() {
    this.steps = null;
  }
}

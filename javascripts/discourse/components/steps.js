import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class Steps extends Component {
  @tracked steps = [];

  constructor() {
    super(...arguments);
    const count = this.args?.params?.count || 5;
    this.steps = [{id:'step-1',content:'<p>Step 1</p>'},{id:'step-2',content:'<p>Step 2</p>'}];

  };

  didInsertElement(){
    console.log('didInsert');
  }
  willDestroy() {
    this.steps = null;
  }
}

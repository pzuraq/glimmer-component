import ApplicationInstance from '@ember/application/instance';
import { setComponentManager } from '@ember/component';
import { gte } from 'ember-compatibility-helpers';
import GlimmerComponentManager from './component-managers/glimmer';

class GlimmerComponent<T = object> {
  constructor(public args: T) {}

  didInsertElement() {}
  didUpdate() {}
  // TODO: should we have this?
  // didRender() {}
  destroy() {}
}

if (gte('3.8.0-beta.1')) {
  setComponentManager((owner: ApplicationInstance) => {
    return new GlimmerComponentManager(owner)
  }, GlimmerComponent);
} else {
  setComponentManager('glimmer', GlimmerComponent);
}

export default GlimmerComponent;

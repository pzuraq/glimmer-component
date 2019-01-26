import ApplicationInstance from '@ember/application/instance';
import { setOwner } from '@ember/application';
import { setComponentManager } from '@ember/component';
import { gte } from 'ember-compatibility-helpers';
import { assert } from '@ember/debug';

import GlimmerComponentManager, {
  DESTROYING,
  DESTROYED,
  MAGIC_ARG,
} from './component-managers/glimmer';

class GlimmerComponent<T = object> {
  constructor(owner: unknown, public args: T, magicArg?: symbol) {
    assert(`You must call 'super()' from your component's constructor and pass all arguments to it with ...arguments. Did not receive all arguments for ${
      this.constructor.name
    }`, magicArg === MAGIC_ARG);

    setOwner(this, owner);
  }

  [DESTROYING] = false;
  [DESTROYED] = false;

  get isDestroying() {
    return this[DESTROYING];
  }

  get isDestroyed() {
    return this[DESTROYED];
  }

  willDestroy() {}
}

if (gte('3.8.0-beta.1')) {
  setComponentManager((owner: ApplicationInstance) => {
    return new GlimmerComponentManager(owner)
  }, GlimmerComponent);
} else {
  setComponentManager('glimmer', GlimmerComponent);
}

export default GlimmerComponent;

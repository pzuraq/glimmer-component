import Ember from 'ember';
import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { capabilities } from '@ember/component';
import { schedule } from '@ember/runloop';
import GlimmerComponent from '../';
import { DEBUG } from '@glimmer/env';

const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');

let MAGIC_ARG: symbol;

if (DEBUG) {
  MAGIC_ARG = Symbol('magic-arg');
}

export { DESTROYING, DESTROYED, MAGIC_ARG };

export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}
type CreateComponentResult = GlimmerComponent<object> & { ___createComponentResult: true };

export default class GlimmerComponentManager {
  static create(attrs: any) {
    let owner = getOwner(attrs);
    return new this(owner);
  }
  capabilities: any;
  constructor(owner: ApplicationInstance) {
    setOwner(this, owner);
    this.capabilities = capabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(Klass: typeof GlimmerComponent, args: ComponentManagerArgs): CreateComponentResult {
    let instance;

    if (DEBUG) {
      instance = new Klass(getOwner(this), args.named, MAGIC_ARG);
    } else {
      instance = new Klass(getOwner(this), args.named);
    }

    return instance as CreateComponentResult;
  }

  updateComponent(component: CreateComponentResult, args: ComponentManagerArgs) {
    set(component, 'args', args.named);
  }

  destroyComponent(component: CreateComponentResult) {
    if (component.isDestroying) {
      return;
    }

    let meta = Ember.meta(component);

    meta.setSourceDestroying();
    component[DESTROYING] = true;

    schedule('actions', component, component.willDestroy);
    schedule('destroy', this, this.scheduledDestroyComponent, component, meta);
  }

  scheduledDestroyComponent(component: GlimmerComponent, meta: Meta) {
    if (component.isDestroyed) {
      return;
    }

    Ember.destroy(component);

    meta.setSourceDestroyed();
    component[DESTROYED] = true;
  }

  didCreateComponent() {}

  didUpdateComponent() {}

  getContext(component: CreateComponentResult) {
    return component;
  }
}

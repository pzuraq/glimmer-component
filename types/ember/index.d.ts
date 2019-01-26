declare module 'ember' {
  // Remove once https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27661 lands
  interface _RegistryProxyMixin {
    register(fullName: string, factory: any, options?: { singleton?: boolean, instantiate?: boolean }): any;
  }

  function meta(obj: object): Meta;
  function destroy(obj: object);
}

class Meta {
  setSourceDestroying();
  setSourceDestroyed();
}

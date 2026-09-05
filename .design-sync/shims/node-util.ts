export function inherits(ctor: any, superCtor: any): void {
  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}

const utilModule = { inherits };
export default utilModule;

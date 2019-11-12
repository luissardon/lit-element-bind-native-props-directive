import { directive } from 'lit-html';
export class BindedProps {
  constructor(_element, _target, _reflect = true) {
    this._element = _element;
    this._target = _target;
    this._reflect = _reflect;
    this._bindedProps = [];
    this._bindedProps = this._bindProps();
  }
  get element() {
    return this._element;
  }
  get target() {
    return this._target;
  }
  get bindedProps() {
    return this._bindedProps;
  }
  get _elementProto() {
    return this.element.constructor.prototype;
  }
  get _propsToShare() {
    return Object.keys(this._elementProto);
  }
  _bindProps() {
    const observableProps = [];
    const bindedProps = this._propsToShare.map(prop => {
      if (Object.getOwnPropertyDescriptor(this.target, prop)) {
        return;
      }
      const elementDescriptor = this._getDescriptor(prop);
      const isReadonly = elementDescriptor.set === undefined;
      const getter = () => this.element[prop];
      const setter = value => (this.element[prop] = value);
      const descriptor = {
        get: getter,
        set: !isReadonly ? setter : undefined,
      };
      if (!isReadonly) {
        observableProps.push(prop.toLowerCase());
        this.target.updateComplete.then(() => {
          const initialValue = this.target.getAttribute(prop);
          console.log('prop', prop, initialValue, this.target)
          if (initialValue !== null) {
            this.target.setAttribute(prop, initialValue);
          }
        });
      }
      Object.defineProperty(this.target, prop, descriptor);
      return prop;
    });
    const observerConfig = {
      attributeFilter: observableProps,
      attributeOldValue: true,
      attributes: true,
    };
    const elementObserver = new MutationObserver(mutations => {
      return mutations.forEach(record => {
        return this._reflectAttributeChanges({
          attr: record.attributeName,
          from: this.element,
          reflect: this._reflect,
          to: this.target,
        });
      });
    });
    elementObserver.observe(this.element, observerConfig);
    const targetObserver = new MutationObserver(mutations => {
      return mutations.forEach(record => {
        return this._reflectAttributeChanges({
          attr: record.attributeName,
          from: this.target,
          reflect: true,
          to: this.element,
        });
      });
    });
    targetObserver.observe(this.target, observerConfig);
    return bindedProps;
  }
  _reflectAttributeChanges(opts) {
    const { from, to, attr, reflect } = opts;
    const currentValue = to.getAttribute(attr);
    const newValue = from.getAttribute(attr);
    if (currentValue === newValue) {
      return;
    }
    if (newValue !== null) {
      if (reflect) {
        to.setAttribute(attr, newValue);
      }
    } else {
      to.removeAttribute(attr);
    }
  }
  _getDescriptor(prop) {
    return Object.getOwnPropertyDescriptor(this._elementProto, prop);
  }
}
const partToBindNativePropsMap = new WeakMap();
export const bindNativeProps = directive(opts => {
  return part => {
    const lastShProps = partToBindNativePropsMap.get(part);
    if (!lastShProps) {
      const element = part.committer.element;
      const target = opts.with;
      const reflect = opts.reflect;
      const bindedProps = new BindedProps(element, target, reflect);
      part.setValue(bindedProps);
      partToBindNativePropsMap.set(part, bindedProps);
    }
  };
});

import { directive, PropertyPart } from 'lit-html';

export interface BindNativePropsOpts {
  with: HTMLElement;
  reflect: boolean | string[];
}

export interface AttributeChangesOpts {
  from: HTMLElement;
  to: HTMLElement;
  attr: string;
  reflect: boolean | string[];
}

export class BindedProps {
  protected _bindedProps: string[] = [];

  constructor(
    private _element: HTMLElement,
    private _target: HTMLElement,
    private _reflect: boolean | string[] = true
  ) {
    this._bindedProps = this._bindProps() as string[];
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

  protected get _elementProto() {
    return this.element.constructor.prototype;
  }

  protected get _propsToShare() {
    return Object.keys(this._elementProto);
  }

  protected _bindProps() {
    const observableProps: string[] = [];
    const bindedProps = this._propsToShare.map(prop => {
      if (Object.getOwnPropertyDescriptor(this.target, prop)) {
        return; // Return early
      }

      const elementDescriptor = this._getDescriptor(prop);
      const isReadonly = elementDescriptor.set === undefined;

      const getter = () => this.element[prop];
      const setter = value => (this.element[prop] = value);

      const descriptor = {
        get: getter,
        set: !isReadonly ? setter : undefined,
      } as PropertyDescriptor;

      if (!isReadonly) {
        observableProps.push(prop.toLowerCase());

        // Set Initial Value
        const initialValue = this.target.getAttribute(prop);

        if (initialValue !== null) {
          this.target.setAttribute(prop, initialValue);
        }
      }

      // Define Prop
      Object.defineProperty(this.target, prop, descriptor);

      return prop;
    });

    const observerConfig: MutationObserverInit = {
      attributeFilter: observableProps,
      attributeOldValue: true,
      attributes: true,
    };

    // Observes and reflects element attribute changes
    const elementObserver = new MutationObserver(mutations =>
      mutations.forEach(record =>
        this._reflectAttributeChanges({
          attr: record.attributeName as string,
          from: this.element,
          reflect: this._reflect,
          to: this.target,
        })
      )
    );

    elementObserver.observe(this.element, observerConfig);

    // Observes and reflects target attribute changes
    const targetObserver = new MutationObserver(mutations =>
      mutations.forEach(record =>
        this._reflectAttributeChanges({
          attr: record.attributeName as string,
          from: this.target,
          reflect: true,
          to: this.element,
        })
      )
    );

    targetObserver.observe(this.target, observerConfig);

    return bindedProps;
  }

  protected _reflectAttributeChanges(opts: AttributeChangesOpts) {
    const { from, to, attr, reflect } = opts;

    const currentValue = to.getAttribute(attr);
    const newValue = from.getAttribute(attr);

    if (currentValue === newValue) {
      return; // Return early
    }

    if (newValue !== null) {
      if (reflect) {
        to.setAttribute(attr, newValue);
      }
    } else {
      to.removeAttribute(attr);
    }
  }

  protected _getDescriptor(prop: string): PropertyDescriptor {
    return Object.getOwnPropertyDescriptor(this._elementProto, prop) as PropertyDescriptor;
  }
}

const partToBindNativePropsMap = new WeakMap<PropertyPart, BindedProps>();

export const bindNativeProps = directive((opts: BindNativePropsOpts) => (part: PropertyPart) => {
  const lastShProps = partToBindNativePropsMap.get(part);

  if (!lastShProps) {
    const element = part.committer.element;
    const target = opts.with;
    const reflect = opts.reflect;

    const bindedProps = new BindedProps(element as HTMLElement, target, reflect);

    part.setValue(bindedProps);
    partToBindNativePropsMap.set(part, bindedProps);
  }
});

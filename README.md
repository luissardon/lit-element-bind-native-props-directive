# lit-element-bind-native-props-directive

> IMPORTANT: This is a work in progress and subject to major changes until 1.0 release.

Lit-html directive that binds native props from a native element to a lit-element component

## Install

```node
npm i lit-element-bind-native-props-directive
```

## Example Usage

```js
import { LitElement, html } from 'lit-element';
import { bindNativeProps } from 'lit-element-bind-native-props-directive';

export class BindedInput extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <input .="${bindNativeProps({ with: this })}">
      </div>
    `;
  }
}

window.customElements.define('binded-input', BindedInput);

```

## API

### Directives

A [directive](https://lit-html.polymer-project.org/guide/creating-directives) is a function that takes a Part as an argument.

```js
DirectiveFn bindNativeProps( BindNativePropsOpts options );
```

#### `bindNativeProps()`

Binds element's properties with a target element and reflects its attributes.

##### Parameters

`options`

A [`BindNativePropsInit`](#bindNativePropsInit) object providing options that describe the element to bind the properties *with* and how to *reflect* the attributes changes.

### Types

<a name="bindNativePropsInit"></a>
#### BindNativePropsInit

The `BindNativePropsInit` object describes the configuration of bind native props. As such, it's used as the type of the options parameter on the `bindNativeProps()` directive.

##### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `with` | `LitElement` | `undefined` | Target element with which binds element's props |
| `reflect` | `boolean|string[]` | `true` | (Optional) A `boolean` value, determines whether to reflect the attributes changes on the *target* element or not. An `string[]` value, determines which attributes are going to be reflected.

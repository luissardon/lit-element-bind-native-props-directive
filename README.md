# lit-element-bind-native-props-directive [![Published on npm](https://img.shields.io/npm/v/lit-element-bind-native-props-directive.svg)](https://www.npmjs.com/package/lit-element-bind-native-props-directive)

> IMPORTANT: This is a work in progress and subject to major changes until 1.0 release.

Lit-html directive that dynamically binds native props from a native element to a lit-element component

## Install

```sh
npm i lit-element-bind-native-props-directive
```

## Example Usage

```js
import { LitElement, html } from 'lit-element';
import { bindNativeProps } from 'lit-element-bind-native-props-directive';

export class BindedInput extends LitElement {
  render() {
    return html`
      <input .="${bindNativeProps({ with: this })}">
    `;
  }
}

window.customElements.define('binded-input', BindedInput);
```

### Placeholder

<image src="images/placeholder.png" width="250" alt="Placeholder" />

```html
<binded-input placeholder="Placeholder"></binded-input>
```

### Type & Value

<image src="images/type-value.png" width="250" alt="Input & Value" />

```html
<binded-input type="button" value="Input Button"></binded-input>
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

A [`BindNativePropsInit`](#bindNativePropsInit) object provides options that describe the element *with* wich bind properties and *reflect* attributes changes.

### Types

<a name="bindNativePropsInit"></a>
#### BindNativePropsInit

The `BindNativePropsInit` object describes the configuration of bind native props. As such, it's used as the type of the options parameter on the `bindNativeProps()` directive.

##### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `with` | `LitElement` | `undefined` | Target element with which binds element's props |
| `reflect` | `boolean|string[]` | `true` | (Optional) A `boolean` value, determines whether to reflect the attributes changes on the *target* element or not. An `string[]` value, determines which attributes are going to be reflected. |

## Integration

| Framework | Status | Issues |
| ---- | ---- | ------- | ----------- |
| [`LitElement`](https://github.com/luissardon/fluent-elements/integrations/lit-element) | *Implemented* | [*Issues*](https://github.com/luissardon/lit-element-bind-native-props-directive/issues?q=is%3Aissue+is%3Aopen+label%3AIntegration%3A%20LitElement) |
| [`React`](https://github.com/luissardon/fluent-elements/integrations/react) | *Planned* | [*Issues*](https://github.com/luissardon/lit-element-bind-native-props-directive/issues?q=is%3Aissue+is%3Aopen+label%3AIntegration%3A%20React) |
| [`Angular`](https://github.com/luissardon/fluent-elements/integrations/react) | *Planned* | [*Issues*](https://github.com/luissardon/lit-element-bind-native-props-directive/issues?q=is%3Aissue+is%3Aopen+label%3AIntegration%3A%20Angular) |
| [`Vue`](https://github.com/luissardon/fluent-elements/integrations/view) | *Planned* | [*Issues*](https://github.com/luissardon/lit-element-bind-native-props-directive/issues?q=is%3Aissue+is%3Aopen+label%3AIntegration%3A%20Vue) |

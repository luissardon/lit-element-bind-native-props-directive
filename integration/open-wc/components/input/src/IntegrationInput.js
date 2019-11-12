import { LitElement, html, css } from 'lit-element';
import { bindNativeProps } from 'lit-element-bind-native-props-directive';

export class IntegrationInput extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="input">
        <input type="text" .="${bindNativeProps({ with: this })}">
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        input {
          font-size: 16px;
          padding: 8px;
        }
      `,
    ];
  }
}

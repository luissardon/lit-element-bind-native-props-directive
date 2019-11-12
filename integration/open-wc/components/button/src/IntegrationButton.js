import { LitElement, html, css } from 'lit-element';
import { bindNativeProps } from 'lit-element-bind-native-props-directive';

export class IntegrationButton extends LitElement {
  constructor() {
    super();
  }

  render() {
    return html`
      <div class="button">
        <button .="${bindNativeProps({ with: this })}">Button</button>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        button {
          font-size: 16px;
          padding: 8px;
        }
      `,
    ];
  }
}

import { html, customElement, property, css, LitElement } from "lit-element";
import * as sampleCode from "./pwab-code";

@customElement("pwab-samples")
export class pwabsamples extends LitElement {
  @property({ type: String })
  theme: string = "lighter";

  @property({ type: String })
  public code: sampleCode.framework;

  @property({ type: Boolean, attribute: "show-copy" })
  public showCopyButton: boolean = false;

  @property({ type: String })
  public color = "#F0F0F0";

  @property({ type: Boolean, attribute: "toolbar" })
  showToolbar: boolean = false;

  @property({ type: Boolean, attribute: "overlay" })
  showOverlay: boolean = false;

  textCopied: boolean = false;

  errors: any[] = [];

  constructor() {
    super();
  }

  static get styles() {
    return css`
      .codeHeader {
        padding-left: 1em;
        padding-bottom: 1em;
        padding-top: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 9999;
      }
      .codeHeader h3 {
        font-family: sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        margin: 0;
        line-height: 24px;
        padding-left: 1em;
        width: 60%;
      }

      .codeHeader div {
        width: 20em;
      }

      .code-sample {
        max-height: 600px;
        overflow: scroll;
      }

      .copyButton {
        background: #c5c5c5;
        color: #3c3c3c;
        border: none;
        border-radius: 20px;
        font-weight: bold;
        font-size: 12px;
        padding-top: 3px;
        padding-bottom: 5px;
        padding-right: 9px;
        padding-left: 9px;
        margin-right: 2em;
      }

      .fas {
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        line-height: 1;
        box-sizing: border-box;
        font-size: 12px;
      }

      @media (max-width: 1079px) {
        .codeHeader h3 {
          font-size: 12px;
        }
      }
    `;
  }

  render() {
    console.log(sampleCode);
    console.log(sampleCode[this.code]);

    return html`<div class="pwab-monaco">
      ${sampleCode[this.code].map((sample) => {
        return html`${this.codeHeader(sample)}
          <pre class="code-sample">${sample.code}</pre> `;
      })}
    </div>`;
  }

  codeHeader(sample: sampleCode.CodeSample) {
    const copyButton = this.showCopyButton
      ? html`<button
          @click="${() => {
            this.copy(sample);
          }}"
          class="copyButton"
        >
          <i class="fas fa-copy platformIcon"></i>
          Copy
        </button>`
      : undefined;
    const copyNotification = this.textCopied
      ? html`<div id="copyToast">Code Copied</div>`
      : undefined;

    return html`<div class="codeHeader">
      <h3>${sample.title}</h3>
      ${copyButton} ${copyNotification}
    </div>`;
  }

  async copy(sample: sampleCode.CodeSample) {
    try {
      await (navigator as any).clipboard.writeText(sample.code);
      this.textCopied = true;

      setTimeout(() => {
        this.textCopied = false;
      }, 1300);
    } catch (err) {
      console.error(err);
    }
  }

  showErrorOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  closeOverlay() {
    this.showOverlay = false;
  }

  getCode(): sampleCode.CodeSample[] {
    return sampleCode[this.code];
  }
}

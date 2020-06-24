import { LitElement, html, customElement, property, css } from "lit-element";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

@customElement("pwab-monaco")
export class pwabmonaco extends LitElement {
  // TODO start chunking away the basic behavior of monaco and have it listen to changes from the parent.

  @property({ type: String })
  public monacoId: string;

  @property({ type: String })
  public code: string;

  @property({ type: Boolean })
  public showCopyButton;

  @property({ type: Boolean })
  showToolbar: boolean = false;

  showOverlay: boolean = false;

  editedCode: string;

  textCopied: boolean = false;

  editor: editor.IStandaloneCodeEditor;

  errors: any[] = [];

  // @property({ type: String })
  // public

  constructor() {
    super();
  }

  static get style() {
    return css``;
  }

  render() {
    return html`<div>
      ${this.codeHeader()}
      <div id="${this.monacoId}"></div>
    </div>`;
  }

  firstUpdated(changedProperties) {}

  updated(changedProperties) {}

  codeHeader() {
    const copyButton = this.showCopyButton
      ? html`<button @click="${() => this.copy()}" class="copyButton">
          <i class="fas fa-copy platformIcon"></i>
          Copy
        </button>`
      : undefined;
    const copyNotification = this.textCopied
      ? html`<div id="copyToast">Code Copied</div>`
      : undefined;

    return html`<div class="codeHeader">
      <slot></slot>
      ${copyButton} ${copyNotification}
    </div>`;
  }

  // TODO
  overlay() {
    if (!this.showOverlay) return;

    return html`<div id="errorOverlay">
      <h2>Errors</h2>

      <ul>
        ${this.errors.map(
          (error) =>
            html`<li>
              <span>Line ${error.startLineNumber}:</span>${error.message}
            </li>`
        )}
      </ul>

      <div id="errorButtonDiv">
        <button id="closeButton" @click="${() => this.closeOverlay()}">
          Close
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>`;
  }

  // TODO
  toolbar() {
    if (!this.showToolbar) return;
    return html` <div id="toolbar">
      <div v-if="errorNumber">
        <button @click="${() => this.showErrorOverlay()}" id="errorsButton">
          <i class="fas fa-exclamation-triangle"></i>
          ${this.errors.length} errors
        </button>
      </div>
      ${!this.errors.length || this.errors.length === 0
        ? html`<div>
            <button id="noErrorsButton">
              <i class="fas fa-exclamation-triangle"></i>
              0 Errors
            </button>
          </div>`
        : undefined}
    </div>`;
  }

  async copy() {
    const code = this.editor.getValue();

    if ((navigator as any).clipboard) {
      try {
        await (navigator as any).clipboard.writeText(code);
        this.textCopied = true;

        setTimeout(() => {
          this.textCopied = false;
        }, 1300);
      } catch (err) {
        console.error(err);
      }
    } else {
      let clipboard = new Clipboard(code);

      clipboard.on("success", (e) => {
        console.info("Action:", e.action);
        console.info("Text:", e.text);
        console.info("Trigger:", e.trigger);

        this.textCopied = true;

        setTimeout(() => {
          this.textCopied = false;
        }, 1300);
        e.clearSelection();
      });

      clipboard.on("error", (e) => {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
      });
    }
  }

  // TODO
  showErrorOverlay() {}

  // TODO
  closeOverlay() {}
}

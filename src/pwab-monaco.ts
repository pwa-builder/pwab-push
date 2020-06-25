import { html, customElement, property, css, LitElement } from "lit-element";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

@customElement("pwab-monaco")
export default class pwabmonaco extends LitElement {
  // TODO start chunking away the basic behavior of monaco and have it listen to changes from the parent.

  @property({ type: String })
  public monacoId: string;

  @property({ type: String })
  theme: string = "lighter";

  @property({ type: String })
  public code: string;

  @property({ type: Boolean })
  public showCopyButton;

  @property({ type: String })
  public color = "#F0F0F0";

  @property({ type: Boolean })
  showToolbar: boolean = false;

  showOverlay: boolean = false;

  editedCode: string;

  textCopied: boolean = false;

  editor: editor.IStandaloneCodeEditor;

  errors: any[] = [];

  monacoOptions = {
    codeType: "javascript",
    value: this.code,
    lineNumbers: "on",
    fixedOverflowWidgets: true,
    wordWrap: "on",
    // wordWrap: "wordWrapColumn",
    // wordWrapColumn: 50,
    scrollBeyondLastLine: false,
    wordWrapMinified: true,
    wrappingIndent: "indent",
    fontSize: 16,
    minimap: {
      enabled: false,
    },
    onCodeChange: this.onCodeChange, // TODO
    onDidChangeModelDecorations: this.onDecorationsChange, // TODO
    editorDidMount: this.editorMount, // TODO
  };

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["showToolbar", "theme"];
  }

  static get style() {
    return css``;
  }

  // TODO make a function create the monacoOptions and a function to create the theme options

  render() {
    return html`<div>
      ${this.codeHeader()}
      <div id="${this.monacoId}"></div>
    </div>`;
  }

  firstUpdated(changedProperties) {
    const container = this.shadowRoot.getElementById("");
    this.editor = (<any>window).monaco.editor.create(container, {
      ...this.monacoOptions,
    });
  }

  updated(changedProperties) {}

  connectedCallback() {
    super.connectedCallback();
    (<any>window).addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    (<any>window).removeEventListener("resize", this.onResize);
  }

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

  toolbar() {
    if (!this.showToolbar) return;

    return html`<div id="toolbar">
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

    try {
      await (navigator as any).clipboard.writeText(code);
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

  onResize() {
    this.removeEditor();
    this.reloadEditor();
  }

  removeEditor() {
    var item = this.monacoId && this.shadowRoot.getElementById(this.monacoId);
    while (item && item.hasChildNodes()) {
      item.firstChild && item.removeChild(item.firstChild);
    }
  }

  reloadEditor() {
    if (!this.monacoId) return;

    this.editor = (<any>window).monaco.editor.create(
      this.shadowRoot.getElementById(this.monacoId),
      {}
    );
    this.defineTheme();
  }

  defineTheme() {
    (<any>window).monaco.editor.defineTheme(`${this.theme}Theme`, {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": this.color,
      },
    });
    (<any>window).monaco.editor.setTheme("lighterTheme");
  }

  onCodeChange() {}

  onDecorationsChange() {}

  editorMount() {}
}

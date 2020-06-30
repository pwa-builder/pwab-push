import { html, customElement, property, css, LitElement } from "lit-element";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

@customElement("pwab-monaco")
export default class pwabmonaco extends LitElement {
  // TODO start chunking away the basic behavior of monaco and have it listen to changes from the parent.

  @property({ type: String, attribute: "monaco-id" })
  public monacoId: string;

  @property({ type: String })
  theme: string = "lighter";

  @property({ type: String })
  public code: string;

  @property({ type: Boolean, attribute: "copy" })
  public showCopyButton: boolean = false;

  @property({ type: String })
  public color = "#F0F0F0";

  @property({ type: Boolean, attribute: "toolbar" })
  showToolbar: boolean = false;

  @property({ type: Boolean, attribute: "overlay" })
  showOverlay: boolean = false;

  editedCode: string; // TODO is this needed?

  textCopied: boolean = false;

  editor: editor.IStandaloneCodeEditor;

  errors: any[] = [];

  monacoOptions = {
    language: "javascript",
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

  static get styles() {
    return css`
      .pwab-monaco #pushSample > * {
        position: relative !important;
      }

      .pwab-monaco #pushSample > * > * {
        position: relative !important;
      }

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
        line-height: 24px;
        padding-left: 1em;
        width: 60%;
      }

      .codeHeader div {
        width: 20em;
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

  // TODO make a function create the monacoOptions and a function to create the theme options

  render() {
    return html`<div>
      ${this.codeHeader()}
      <div id="${this.monacoId}"></div>
    </div>`;
  }

  firstUpdated(changedProperties) {
    const container = this.shadowRoot.getElementById(this.monacoId);
    this.editor = (window as any).monaco.editor.create(container, {
      ...this.monacoOptions,
    });
  }

  // updated(changedProperties) {}

  connectedCallback() {
    super.connectedCallback();
    (window as any).addEventListener("resize", () => this.onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    (window as any).removeEventListener("resize", () => this.onResize);
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

  createRenderRoot() {
    return this;
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
      // TODO display error
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

    this.editor = (window as any).monaco.editor.create(
      this.shadowRoot.getElementById(this.monacoId),
      this.monacoOptions
    );
    this.defineTheme();
  }

  defineTheme() {
    (window as any).monaco.editor.defineTheme(`${this.theme}Theme`, {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": this.color,
      },
    });
    (window as any).monaco.editor.setTheme("lighterTheme");
  }

  onCodeChange() {
    // TODO emit event? not 100% sure if needed

    console.log("onCodeChange", arguments);
    // this.$emit("editorValue", this.code);
  }

  onDecorationsChange() {
    console.log("onDecorationsChange", arguments);
    this.errors = (window as any).monaco.editor.getModelMarkers({});

    if (this.errors.length > 0) {
      // this.$emit("invalidManifest");
    }
  }

  editorMount() {
    console.log("editorMount", arguments);
    // this.editor = editor; // TODO ????

    // console.log("editor mount", editor);
  }
}

import { html, customElement, property, css, LitElement } from "lit-element";
import { editor, IDisposable } from "monaco-editor/esm/vs/editor/editor.api";

@customElement("pwab-monaco")
export default class pwabmonaco extends LitElement {
  @property({ type: String, attribute: "monaco-id" })
  public monacoId: string;

  @property({ type: String })
  theme: string = "lighter";

  @property({ type: String })
  public code: string;

  @property({ type: Boolean, attribute: "show-copy" })
  public showCopyButton: boolean = false;

  @property({ type: String })
  public color = "#F0F0F0";

  @property({ type: Boolean, attribute: "toolbar" })
  showToolbar: boolean = false;

  @property({ type: Boolean, attribute: "overlay" })
  showOverlay: boolean = false;

  editedCode: string;

  textCopied: boolean = false;

  editor?: editor.IStandaloneCodeEditor;

  @property({ type: Number, attribute: "editor-height" })
  editorHeight: number = 600;

  @property({ type: Number, attribute: "editor-width" })
  editorWidth: number = 627;

  errors: any[] = [];

  monacoOptions = {
    language: "javascript",
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
    onDidChangeModelContent: () => this.onCodeChange,
    onDidChangeModelDecorations: () => this.onDecorationsChange,
    editorDidMount: () => this.editorMount,
  };

  constructor() {
    super();

    window.addEventListener("resize", () => {
      console.log("resized()");
      this.handleResize();
    });
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

  shouldUpdate(changedProperties: Map<string, any>): boolean {
    if (changedProperties.has("code")) {
      this.editor = null;
    }

    return super.shouldUpdate(changedProperties);
  }

  update(changedProperties) {
    this.createContainer();
    super.update(changedProperties);
  }

  render() {
    return html`<div class="pwab-monaco">
      ${this.codeHeader()} ${this.getContainer()}
    </div>`;
  }

  updated(changedProperties) {
    this.rebindEvents();
    super.updated(changedProperties);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  codeHeader() {
    const copyButton = this.showCopyButton
      ? html`<button @click="${this.copy}" class="copyButton">
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

  handleResize() {
    this.requestUpdate();
  }

  createContainer() {
    const div = document.createElement("div");
    const body = document.getElementsByTagName("body")[0];
    div.id = this.monacoId;
    div.style.height = "" + this.editorHeight;
    div.style.width = "" + this.editorWidth;

    body.appendChild(div);

    this.editor = (window as any).monaco.editor.create(
      document.getElementById(this.monacoId),
      {
        value: this.editor ? this.editor.getValue() : this.code,
        ...this.monacoOptions,
      }
    ) as editor.IStandaloneCodeEditor;
    this.defineTheme();
  }

  getContainer() {
    return document
      .getElementsByTagName("body")[0]
      .removeChild(document.getElementById(this.monacoId));
  }

  rebindEvents() {
    this.editor.onDidChangeModelContent((e) => {
      this.onCodeChange(e);
    });
    this.editor.onDidChangeModelDecorations((e) => {
      this.onDecorationsChange(e);
    });
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
    (window as any).monaco.editor.setTheme(`${this.theme}Theme`);
  }

  onCodeChange(evt: editor.IModelContentChangedEvent) {}

  onDecorationsChange(evt: editor.IModelDecorationsChangedEvent) {}

  editorMount() {
    console.log("editorMount", arguments);
    // this.editor = editor; // TODO ????

    // console.log("editor mount", editor);
  }
}

import { LitElement, html, customElement, property, css } from "lit-element";
import {
  PwabVapidResponse,
  PwabNotificationResponse,
  VapidKeys,
  NotificationOptions,
} from "./pwab-types";
import * as sampleCode from "./pwab-code";
import * as utils from "./pwab-utils";
import "./pwab-monaco";

@customElement("pwab-push")
export class pwabpush extends LitElement {
  @property({ type: String }) swCode: string;
  @property({ type: String }) userEmail: string = "";

  @property({ type: String }) notificationTitle: string = "";
  @property({ type: String }) notificationBody: string = "";
  @property({ type: String }) notificationIcon: string = "";

  @property({ type: String }) editorText: string = "";

  @property({ type: String }) url: string =
    "https://pwabuilder-api-prod.azurewebsites.net/push";

  vapidKeys: VapidKeys;

  vanillaCode: string = sampleCode.vanilla;
  reactCode: string = sampleCode.react;
  angularCode: string = sampleCode.angular;
  vueCode: string = sampleCode.vue;

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;

        --font-color: #3c3c3c;
      }

      #wrapper {
        display: flex;
        justify-content: space-between;
      }

      #instructionsList {
        margin-bottom: 4em;
      }

      #leftColumn h3 {
        font-style: normal;
        font-weight: 600;
        font-size: 30px;
        line-height: 45px;
        letter-spacing: -0.02em;
        color: var(--font-color);
      }

      #leftColumn p {
        font-style: normal;
        font-size: 14px;
        line-height: 21px;
      }

      #leftColumn p#introText {
        margin-left: initial;
      }

      #leftColumn .formWrapper {
        padding-left: 7em;
      }

      #leftColumn {
        flex: 1;
      }

      #leftColumn .step {
        max-height: 5em;
        overflow: hidden;
        transition: max-height 0.25s ease-in-out;
      }

      #leftColumn .step.open {
        max-height: 100vh;
      }

      #leftColumn #stepTwo.step.open {
        max-height: 160vh;
      }

      #rightColumn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin-top: 3em;
        height: 39em;
      }

      #rightColumn img {
        width: 400px;
      }

      .stepTextWrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .stepTextWrapper img {
        height: 60px;
        width: 60px;
        object-fit: contain;
        margin-right: 8px;
      }

      .stepText {
        font-weight: 600;
        font-size: 24px;
        line-height: 36px;
        color: #3c3c3c;
      }

      h4 {
        font-weight: normal;
        font-size: 24px;
        color: grey;
      }

      #emailButton:disabled {
        border-color: rgb(170, 170, 170);
      }

      #emailInputWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
      }

      #emailInputWrapper button {
        border: 1px solid #3c3c3c;
        border-radius: 16px;
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 28px;
        padding-left: 14px;
        padding-right: 14px;
        cursor: pointer;
      }

      #emailInputLabel {
        display: flex;
        flex-direction: column;
      }

      #emailInputLabel label {
        font-weight: bold;
        font-size: 14px;
        line-height: 24px;
      }

      #emailInput {
        width: 26em;
      }

      input[type="email"] {
        border: none;
        border-bottom: 1px solid rgba(60, 60, 60, 0.3);
        color: #3c3c3c;

        background: transparent;
        padding-bottom: 16px;
        width: 26em;

        outline: none;
      }

      #projectSelect {
        border: none;
        border-bottom: 1px solid rgba(60, 60, 60, 0.3);
        width: 20em;
        padding-bottom: 7px;
        padding-top: 8px;
        font-weight: bold;
        background: transparent;
      }

      .actionsBlock {
        background: #c4c4c463;
        border-radius: 6px;
        padding-left: 18px;
        padding-right: 18px;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-top: 44px;
      }

      .actionsBlock h5 {
        margin: 0;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
      }

      .actionButtons {
        display: flex;
      }

      .actionButtons .primaryAction {
        background: linear-gradient(90deg, #1fc2c8 0%, #9337d8 169.8%);
        border-radius: 20px;
        color: white;
        border: none;

        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;

        padding-left: 18px;
        padding-right: 18px;
        padding-top: 6px;
        padding-bottom: 6px;
        cursor: pointer;

        margin-top: 16px;
      }

      #stepThreeActions {
        margin-top: initial;
      }

      #stepThreeActions input {
        border: none;
        border-bottom: solid grey 1px;
        background: transparent;
        font-weight: normal;
        font-size: 14px;
        line-height: 24px;
        margin-bottom: 30px;
      }

      #stepThree #sendButton {
        background: linear-gradient(90deg, #1fc2c8 0%, #9337d8 169.8%);
        border-radius: 20px;
        border: none;
        color: white;
        font-size: 14px;
        line-height: 21px;
        padding-top: 10px;
        padding-bottom: 9px;
        padding-left: 18px;
        padding-right: 18px;
        margin-top: 30px;
      }

      @media (max-width: 905px) {
        #wrapper {
          flex-direction: column;
        }

        #leftColumn .formWrapper {
          padding-left: 0em;
        }

        #emailInput {
          width: 20em;
        }

        #rightColumn {
          display: none;
        }
      }

      @media (max-width: 430px) {
        #emailInput {
          width: 17em;
        }
      }
    `;
  }

  constructor() {
    super();

    this.swCode = this.reactCode;
  }

  openStep(step: string) {
    const stepToOpen: HTMLDivElement = this.shadowRoot.querySelector(
      `#${step}`
    );

    const openedItems = this.shadowRoot.querySelectorAll(".open");
    console.log(openedItems);

    if (openedItems) {
      for (let i = 0; i < openedItems.length; i++) {
        console.log(openedItems[i]);
        openedItems[i].classList.remove("open");
      }
    }

    stepToOpen.classList.toggle("open");
  }

  selectProject(event) {
    const value = event.target.value;

    switch (value) {
      case "angularCode":
        this.swCode = this.angularCode;
        break;
      case "reactCode":
        this.swCode = this.reactCode;
        break;
      case "vueCode":
        this.swCode = this.vueCode;
        break;
      case "vanillaCode":
        this.swCode = this.vanillaCode;
    }
  }

  addEmail(evt) {
    const emailNode = this.shadowRoot.getElementById(
      "emailInput"
    ) as HTMLInputElement;

    this.userEmail = emailNode.value;
    this.requestUpdate();
  }

  async clickGenerateAndRegisterButton() {
    try {
      this.vapidKeys = await this.createVapidKeys();
      await this.registerKeys();
      this.emailVapidKeys();
    } catch (e) {
      console.log("something failed, please try again");
    }
  }

  async createVapidKeys(): Promise<VapidKeys> {
    const { keys }: PwabVapidResponse = await fetch(
      this.url + "/create"
    ).then((res) => res.json());

    return {
      ...keys,
    };
  }

  async registerKeys() {
    const response = await fetch(this.url + "/register", {
      method: "POST",
      body: JSON.stringify({
        userEmail: this.userEmail,
        ...this.vapidKeys,
      }),
    }).then((res) => res.json());

    return response;
  }

  async subscribe() {
    var registration = await navigator.serviceWorker.register(
      "pwabuilder-sw.js",
      {
        scope: "./",
      }
    );

    var subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const convertedVapidKey = utils.urlBase64ToUint8Array(
        this.vapidKeys.publicKey
      );
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const response = await fetch(this.url + "/subscribe", {
        method: "POST",
        body: JSON.stringify({
          subscription: subscription,
          publicKeys: this.vapidKeys.publicKey,
        }),
      }).then((res) => res.json());
    }
  }

  async unsubscribe() {
    var registration = await navigator.serviceWorker.register(
      "pwabuilder-sw.js",
      {
        scope: "./",
      }
    );

    var subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      alert("You are not subscribed.");
      return;
    }

    await subscription.unsubscribe();

    const response = await fetch(this.url + "/unsubscribe", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: JSON.stringify(subscription),
        publicKey: this.vapidKeys.publicKey,
      }),
    }).then((res) => res.json());
  }

  emailVapidKeys() {
    const subject = `PWA Builder VAPID Key Info`;
    const body = `Here is the VAPID key you generated for your PWA app at https://www.pwabuilder.com\nprivateKey:${this.vapidKeys.privateKey}\npublicKey:${this.vapidKeys.publicKey}\nsubject:${this.userEmail}\n`;

    window.open(
      encodeURI(`mailto:${this.userEmail}?subject=${subject}&body=${body}`)
    );
  }

  async sendNotification() {
    try {
      const response: PwabNotificationResponse = await fetch(
        this.url + "/send",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            ...this.vapidKeys,
            subject: this.userEmail,
            notification: JSON.stringify({
              ...NotificationOptions,
              title:
                this.notificationTitle !== ""
                  ? this.notificationTitle
                  : NotificationOptions.title,
              body:
                this.notificationBody !== ""
                  ? this.notificationBody
                  : NotificationOptions.body,
              icon:
                this.notificationIcon !== ""
                  ? this.notificationIcon
                  : NotificationOptions.icon,
            }),
          }),
        }
      ).then((res) => res.json());
    } catch (e) {
      console.log("failed to send notification");
    }
  }

  validUserEmail() {
    return (
      this.userEmail &&
      this.userEmail !== "" &&
      this.userEmail.match(/^\S+@\S+\.\S+$/) &&
      this.userEmail.match(/^\S+@\S+\.\S+$/).length == 1
    );
  }

  render() {
    return html`
      <div id="wrapper">
        <section id="leftColumn">
          <h3>Web Push Notifications</h3>

          <p id="introText">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            faucibus luctus libero sit amet sodales. Vivamus dui ex, luctus et
            condimentum ut, aliquam in nibh. Sed eleifend accumsan ante, sed
            elementum urna porttitor gravida. Quisque lobortis ut arcu ac
            condimentum. Proin sit amet viverra ex. Sed felis metus, malesuada
            sit amet dolor ac, tempus posuere felis. Praesent faucibus pretium
            aliquam. Suspendisse a mauris eros. Aenean malesuada tortor lectus,
            imperdiet mattis sem venenatis sed. Vestibulum augue tellus, ornare
            sit amet sapien ut, placerat vehicula dolor. Mauris at tempus purus,
            a aliquam sapien. Suspendisse et tempus lectus. Quisque sit amet
            euismod tellus. Donec a ultrices diam. Ut tempor erat nec lacus
            tempus, eget iaculis orci suscipit. Nullam tristique quis dolor
            semper sodales.
          </p>

          <div id="instructionsList">
            <div class="step open" id="stepOne">
              <div
                class="stepTextWrapper"
                @click="${() => this.openStep("stepOne")}"
              >
                <img src="/Images/server.png" />

                <h4><span class="stepText">Step 1:</span> Setup server Side</h4>
              </div>

              <div class="formWrapper">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                  faucibus luctus libero sit amet sodales. Vivamus dui ex,
                  luctus et condimentum ut, aliquam in nibh. Sed eleifend
                  accumsan ante, sed elementum urna porttitor gravida.
                </p>

                <div id="emailInputWrapper">
                  <div id="emailInputLabel">
                    <label for="emailInput">
                      Email:
                    </label>

                    <input
                      type="email"
                      id="emailInput"
                      name="emailInput"
                      placeholder="janedoe@something.com"
                      .value=${this.userEmail}
                    />
                  </div>

                  <button
                    id="emailButton"
                    @click=${this.addEmail}
                    ?disabled=${this.validUserEmail()}
                  >
                    ${this.validUserEmail() ? "Email added" : "Add Email"}
                  </button>
                </div>

                <div class="actionsBlock">
                  <h5>Generate Vapid Keys</h5>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>

                  <h5>Registration</h5>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>

                  <h5>Email Confirmation</h5>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>

                  <div class="actionButtons">
                    <button
                      class="primaryAction"
                      @click=${this.clickGenerateAndRegisterButton}
                    >
                      Generate and Register VAPID Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="step" id="stepTwo">
              <div
                @click="${() => this.openStep("stepTwo")}"
                class="stepTextWrapper"
              >
                <img src="/Images/client.png" />

                <h4><span class="stepText">Step 2:</span> Setup client Side</h4>
              </div>

              <div class="formWrapper">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                  faucibus luctus libero sit amet sodales. Vivamus dui ex,
                  luctus et condimentum ut, aliquam in nibh. Sed eleifend
                  accumsan ante, sed elementum urna porttitor gravida.
                </p>

                <p>Please select a project type:</p>

                <div id="emailInputWrapper">
                  <div id="emailInputLabel">
                    <label for="projectSelect">
                      Project Type:
                    </label>

                    <select
                      @change=${this.selectProject}
                      id="projectSelect"
                      name="projectSelect"
                    >
                      <option value="reactCode">React</option>
                      <option value="vueCode">Vue</option>
                      <option value="angularCode">Angular</option>
                      <option value="vanillaCode">Vanilla JS</option>
                    </select>
                  </div>
                </div>

                <div class="actionsBlock">
                  <button @click=${this.subscribe}>Subscribe</button>

                  <pwab-monaco
                    monaco-id="pushSample"
                    code="${this.swCode}"
                    show-copy
                  >
                    <h5>Add this code to your service worker</h5>
                  </pwab-monaco>
                  <div id="clientCode" style="display: none;"></div>
                </div>
              </div>
            </div>

            <div class="step" id="stepThree">
              <div
                @click="${() => this.openStep("stepThree")}"
                class="stepTextWrapper"
              >
                <img src="/Images/test.png" />

                <h4>
                  <span class="stepText">Step 3:</span> Send test notification
                </h4>
              </div>

              <div class="formWrapper">
                <div id="stepThreeActions" class="actionsBlock">
                  <div id="emailInputLabel">
                    <label for="titleInput">
                      Notification title
                    </label>

                    <input
                      type="text"
                      id="titleInput"
                      name="titleInput"
                      placeholder="notification title"
                      .value="${this.notificationTitle}"
                    />
                  </div>

                  <div id="emailInputLabel">
                    <label for="bodyInput">
                      Notification body
                    </label>

                    <input
                      type="text"
                      id="bodyInput"
                      name="bodyInput"
                      placeholder="notification body"
                      .value="${this.notificationBody}"
                    />
                  </div>

                  <div id="emailInputLabel">
                    <label for="icon-url-input">
                      Icon path for the badge notification
                    </label>
                    <input
                      type="text"
                      id="iconUrlInput"
                      name="icon-url-input"
                      placeholder="https://www.example/images/icon.png"
                      .value="${this.notificationIcon}"
                    />
                  </div>
                </div>

                <button id="sendButton" @click=${this.sendNotification}>
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="rightColumn">
          <img src="/Images/top.png" />
          <img src="/Images/bottom.png" />
        </section>
      </div>
    `;
  }
}

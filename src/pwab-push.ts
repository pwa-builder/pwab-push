import {
  LitElement, html, customElement, property, css
} from 'lit-element';

@customElement('pwab-push')
export class pwabpush extends LitElement {

  @property({ type: String }) swCode: string;

  reactCode: string = "<script>window.React</script>";
  angularCode: string = "<script>window.Angular</script>";
  vueCode: string = "<script>window.Vue</script>";

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;

        --font-color: #3C3C3C;
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
        transition: max-height .25s ease-in-out;
      }

      #leftColumn .step.open {
        max-height: 100vh;
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
        color: #3C3C3C;
      }

      h4 {
        font-weight: normal;
        font-size: 24px;
        color: grey;
      }

      #emailInputWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
      }

      #emailInputWrapper button {
        border: 1px solid #3C3C3C;
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

      input[type=email] {
        border: none;
        border-bottom: 1px solid rgba(60, 60, 60, 0.3);
        color: #3C3C3C;

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
        background: linear-gradient(90deg, #1FC2C8 0%, #9337D8 169.8%);
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
        background: linear-gradient(90deg, #1FC2C8 0%, #9337D8 169.8%);
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

      @media(max-width: 905px) {
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

      @media(max-width: 430px) {
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
    const stepToOpen: HTMLDivElement = this.shadowRoot.querySelector(`#${step}`);

    const openedItems = this.shadowRoot.querySelectorAll('.open');
    console.log(openedItems);

    if (openedItems) {
      for (let i = 0; i < openedItems.length; i++) {
        console.log(openedItems[i]);
        openedItems[i].classList.remove('open');
      }
    }

    stepToOpen.classList.toggle('open');
  }

  selectProject(event) {
    console.log(event.target.value);
    const value = event.target.value;

    switch (value) {
      case 'angularCode':
        this.swCode = this.angularCode;
        break;
      case 'reactCode':
        this.swCode = this.reactCode;
        break;
      case 'vueCode':
        this.swCode = this.vueCode;
        break;
    }
  }

  render() {
    return html`
      <div id="wrapper">
        <section id="leftColumn">
          <h3>Web Push Notifications</h3>

          <p id="introText">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam faucibus luctus libero sit amet sodales. 
              Vivamus dui ex, luctus et condimentum ut, aliquam in nibh. Sed eleifend accumsan ante, sed elementum urna porttitor gravida. 
              Quisque lobortis ut arcu ac condimentum. Proin sit amet viverra ex. Sed felis metus, malesuada sit amet dolor ac, tempus posuere felis. 
              Praesent faucibus pretium aliquam. Suspendisse a mauris eros. 
              Aenean malesuada tortor lectus, imperdiet mattis sem venenatis sed. 
              Vestibulum augue tellus, ornare sit amet sapien ut, placerat vehicula dolor. 
              Mauris at tempus purus, a aliquam sapien. Suspendisse et tempus lectus. 
              Quisque sit amet euismod tellus. Donec a ultrices diam. Ut tempor erat nec lacus tempus, eget iaculis orci suscipit. 
              Nullam tristique quis dolor semper sodales.
          </p>

          <div id="instructionsList">
            <div class="step open" id="stepOne">

              <div class="stepTextWrapper"  @click="${() => this.openStep('stepOne')}">
                <img src="/Images/server.png">

                <h4><span class="stepText">Step 1:</span> Setup server Side</h4>
              </div>

              <div class="formWrapper">
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam faucibus luctus libero sit amet sodales. 
                Vivamus dui ex, luctus et condimentum ut, aliquam in nibh. Sed eleifend accumsan ante, sed elementum urna porttitor gravida. 
                </p>

                <div id="emailInputWrapper">

                  <div id="emailInputLabel">
                    <label for="emailInput">
                      Email:
                    </label>

                    <input type="email" id="emailInput" name="emailInput" placeholder="janedoe@something.com">
                  </div>

                  <button id="emailButton">Add Email</button>
                </div>

                <div class="actionsBlock">
                  <h5>Generate Vapid Keys</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                  <h5>Registration</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                  <h5>Email Confirmation</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                  <div class="actionButtons">
                    <button class="primaryAction">
                      Generate and Regsiter VAPID Keys
                    </button>
                  </div>
                </div>
              </div>
            </div> 

            <div class="step" id="stepTwo">
              <div @click="${() => this.openStep('stepTwo')}" class="stepTextWrapper">
                <img src="/Images/client.png">

                <h4><span class="stepText">Step 2:</span> Setup client Side</h4>
              </div>

              <div class="formWrapper">
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam faucibus luctus libero sit amet sodales. 
                Vivamus dui ex, luctus et condimentum ut, aliquam in nibh. Sed eleifend accumsan ante, sed elementum urna porttitor gravida. 
                </p>

                <p>Please select a project type:</p>

                <div id="emailInputWrapper">
                  <div id="emailInputLabel">

                    <label for="projectSelect">
                      Project Type:
                    </label>

                    <select @change="${(event) => this.selectProject(event)}" id="projectSelect" name="projectSelect">
                      <option value="reactCode">React</option>
                      <option value="vueCode">Vue</option>
                      <option value="angularCode">Angular</option>
                    </select>
                  </div>
                </div>

                <div class="actionsBlock">
                  <h5>Add this code to your project</h5>
                  
                  <code>
                    ${this.swCode}
                  </code>
                </div>
              </div>
            </div>

            <div class="step" id="stepThree">
              <div @click="${() => this.openStep('stepThree')}" class="stepTextWrapper">
                <img src="/Images/test.png">

                <h4><span class="stepText">Step 3:</span> Send test notification</h4>
              </div>

              <div class="formWrapper">
                <div id="stepThreeActions" class="actionsBlock">

                  <div id="emailInputLabel">
                    <label for="titleInput">
                      Notification title
                    </label>

                    <input type="text" id="titleInput" name="titleInput" placeholder="notification title">
                  </div>

                  <div id="emailInputLabel">
                    <label for="bodyInput">
                      Notification body
                    </label>

                    <input type="text" id="bodyInput" name="bodyInput" placeholder="notification body">
                  </div>
                </div>

                <button id="sendButton">Send Notification</button>
            </div>
          </div>
          </div>
        </section>

        <section id="rightColumn">
          <img src="/Images/top.png">
          <img src="/Images/bottom.png">
        </section>
      </div>
    `;
  }
}

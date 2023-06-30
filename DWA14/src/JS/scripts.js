import { html, css, LitElement } from 'lit';

const MAX_NUMBER = 15;
const MIN_NUMBER = -5;
const STEP_AMOUNT = 5;

class TallyCounter extends LitElement {
  static styles = css`
    .counter {
      display: flex;
      align-items: center;
    }

    .counter__value {
      font-size: 24px;
      padding: 8px;
      width: 60px;
      text-align: center;
    }

    .counter__actions {
      display: flex;
      flex-direction: column;
    }

    .counter__button {
      font-size: 18px;
      padding: 4px 8px;
      margin-top: 4px;
    }

    .counter__button_first {
      margin-bottom: 4px;
    }

    .counter__state {
      margin-top: 16px;
      font-weight: bold;
    }

    .counter__state--minimum {
      color: red;
    }

    .counter__state--maximum {
      color: green;
    }
  `;

  static properties = {
    value: { type: Number },
    state: { type: String },
  };

  constructor() {
    super();
    this.value = 0;
    this.state = 'Normal';
  }

  subtract() {
    const newValue = this.value - STEP_AMOUNT;
    this.value = newValue;

    this.updateButtonStates();
    this.updateState();
  }

  add() {
    const newValue = this.value + STEP_AMOUNT;
    this.value = newValue;

    this.updateButtonStates();
    this.updateState();
  }

  updateButtonStates() {
    const subtractButton = this.shadowRoot.querySelector('[data-key="subtract"]');
    const addButton = this.shadowRoot.querySelector('[data-key="add"]');

    subtractButton.disabled = this.value <= MIN_NUMBER;
    addButton.disabled = this.value >= MAX_NUMBER;
  }

  updateState() {
    if (this.value <= MIN_NUMBER) {
      this.state = 'Minimum Reached';
    } else if (this.value >= MAX_NUMBER) {
      this.state = 'Maximum Reached';
    } else {
      this.state = 'Normal';
    }
  }

  render() {
    return html`
      <main class="counter">
        <input class="counter__value" data-key="number" readonly .value=${this.value}>
        <div class="counter__actions">
          <button data-key="subtract" class="counter__button counter__button_first" @click=${this.subtract}>-</button>
          <button data-key="add" class="counter__button" @click=${this.add}>+</button>
        </div>
      </main>
      <div class="counter__state ${this.state === 'Minimum Reached' ? 'counter__state--minimum' : this.state === 'Maximum Reached' ? 'counter__state--maximum' : ''}">
        ${this.state}
      </div>
    `;
  }
}

customElements.define('tally-counter', TallyCounter);
const input = document.getElementById("input");
const output = document.getElementById("output");

const termPS1 = function () {
  const el = document.createElement("span");
  el.className = "ps1";
  el.textContent = "> ";
  return el;
};

const sendMessage = function (message) {
  const messageEl = document.createElement('div');

  const messageText = document.createElement("span");
  messageText.textContent = message;

  messageEl.appendChild(termPS1());
  messageEl.appendChild(messageText);

  output.appendChild(messageEl);
  output.scrollTop = output.scrollHeight;
};

const sendMessages = function (...args) {
  args.forEach(sendMessage);
};

const state = {
  current: 'intro'
};

const states = {
  intro: function (state) {
    sendMessage("Your eyes are closed.");

    state.waitForInput = true;
    return state;
  }
};

const gameLoop = function (state) {
  states[state.current](state);
};

gameLoop(state);

//# sourceMappingURL=matt-compiled.js.map
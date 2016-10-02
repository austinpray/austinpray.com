import curry from "lodash/curry";
import some from "lodash/some";
import delay from "lodash/delay";
import random from "lodash/random";
import marked from "marked";
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: false,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

const input = document.getElementById("input");
const output = document.getElementById("output");

const MESSAGE_PS1 = Symbol("message ps1");
const HELP_PS1 = Symbol("help ps1");
const USER_PS1 = Symbol("user ps1");

const termPS1 = function (type) {
  const el = document.createElement("span");
  switch(type) {
    case HELP_PS1:
      el.className = "ps1 help-ps1";
      el.textContent = "? ";
      break;
    case USER_PS1:
      el.className = "ps1 user-ps1";
      el.textContent = "! ";
      break;
    case MESSAGE_PS1:
    default:
      el.className = "ps1";
      el.textContent = "> ";
  }
  return el;
};

const sendMessage = curry(function (ps1, message) {
  const messageEl = document.createElement('div');
  messageEl.className = "message";

  const messageText = document.createElement("div");
  messageText.className = "message-text";
  messageText.innerHTML = marked(message);

  messageEl.appendChild(termPS1(ps1));
  messageEl.appendChild(messageText);

  output.appendChild(
    messageEl
  );
  output.scrollTop = output.scrollHeight;
});

const sendInfoMessage = sendMessage(MESSAGE_PS1);
const sendHelpMessage = sendMessage(HELP_PS1);

const sendMessages = function (ps1, ...args) {
  args.forEach(sendMessage(ps1));
};

const sendImage = function (path) {
  const img = new Image();
  img.src = path;
  const messageEl = document.createElement('div');
  messageEl.className = "message";
  messageEl.appendChild(img);
  output.appendChild(messageEl);
  img.onload = function () {
    output.scrollTop = output.scrollHeight;
  }
};

const contains = function (input, ...targets) {
  return some(targets, (target) => input.toLowerCase().indexOf(target.toLowerCase()) > -1);
};

const handlerMiddleware = function (input, state) {
  if (
    contains(input, "who am") ||
    contains(input, "what", "my name")
  ) {
    sendMessage(MESSAGE_PS1, "Austin");
  }

  if (contains(input, "penis", "cock", "cok", "dick")) {
    sendMessage(HELP_PS1, "Stahhp");
  }

  if (contains(input, "reee")) {
    sendMessage(MESSAGE_PS1, "You let out a mighty frog squeal, nothing happens")
  }

  return state.handle(input);
};

const cannedMessages = {
  showPhone: function () {
    sendImage("/assets/old_phone.jpg");
    sendInfoMessage("**WHAT IN THE FUCK IS THIS THING??**");
    sendInfoMessage("The battery died after getting a glimpse of the home screen.");
    sendInfoMessage("You got an iPhone in 2010.");
  }
};

const states = {
  intro: function (state = {}) {
    sendMessage(MESSAGE_PS1, "Your eyes are closed.");

    return {
      name: "intro",
      ...state,
      handle: function (input) {
        if(contains(input, "open")) {
          return states.eyesOpen(state);
        }
        sendMessage(MESSAGE_PS1, "You can't see anything");
      }
    };
  },
  eyesOpen: function (state = {}) {
    sendImage("/assets/matt_living.jpg");
    sendMessages(
      MESSAGE_PS1,
      "You open your eyes.",
      "You are in familiar place. Matt's old game room. The old Quanah drive house in round rock. You are sitting on the couch.",
      "Straight ahead of you is a _TV_ blaring Super Smash Brothers Melee. The _gamecube_ is on the ground.",
      "You look over to the right: _Matt_ is sitting in the love seat hammering away at a gamecube controller. His eyes are transfixed on the screen.",
      "You glance left: _Brittany_ is sitting in the other loveseat on the other side of the room. She is clumsily mashing buttons on the controller, but is having fun regardless.",
      "",
      "How the heck are you even here? Didn't Matt's parents sell this place a while ago?"
    );

    delay(
      () => sendMessage(
        HELP_PS1, "You can `inspect` things. You can also `stand up`. You can check your `pockets` as well."),
      3000
    );
    return {
      ...state,
      name: "eyesOpen",
      handle: function (input) {

        if (contains(input, "what") && contains(input, "wearing")) {
          return sendInfoMessage("");
        }

        if (contains(input, "inspect", "look")){
          if(contains(input,"gamecube", "game", "cube")) {
            return sendInfoMessage("Matt is always fucking playing smash.")
          }
          if(contains(input,"TV")) {
            return sendInfoMessage(
              "They are playing on smash on...looks like fountain of dreams? " +
              "Haha fitting. This is probably a dream. No way "
            );
          }
          if(contains(input, "matt")) {
            return sendMessage(
              MESSAGE_PS1,
              "Matt is wrecking brittany at smash. " +
              "He's wearing a yellow shirt and jeans. " +
              "He looks much younger than the last time you saw him."
            )
          }
          if(contains(input, "brittany")) {
            return sendMessage(MESSAGE_PS1, "Brittany is wearing a gray v-neck and jeans. No surprises here.")
          }
        }

        if (contains(input, "say", "talk", "yell")) {
          return sendInfoMessage("They are too busy playing the game to talk.");
        }

        if (contains(input, "pockets")) {
          sendInfoMessage("You check your pockets");
          cannedMessages.showPhone();
          return;
        }

        if (contains(input, "stand up", "get up", "get off")) {
          return states.gameRoomStandUp(state);
        }
      }
    }
  },
  gameRoomStandUp: function (state = {}) {
    sendMessages(
      MESSAGE_PS1,
      "You are definitely spooked. You can't remember how you got inside Matt's old house. " +
      "You can't remember ",
      "You stand up to inspect the rest of the room.",
      "Behind Matt you see a door than you know leads to the balcony."
    );
    return {
      ...state,
      name: "gameRoomStandUp",
      handle: function (input) {
        if (contains(input, "pockets")) {
          sendInfoMessage("You check your pockets");
          cannedMessages.showPhone();
          return;
        }
      }
    }
  }
};

const state = {
  pockets: {
  },
  ...states.intro()
};

const form = document.getElementById("inputForm");
const userInput = document.getElementById("userInput");

const getInput = function () {
  const input = userInput.value;
  userInput.value = "";
  sendMessage(USER_PS1, input);
  return input;
};

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const input = getInput();
  if (input === "debug") {
    return console.log(state);
  }
  const newState = handlerMiddleware(input, state);
  if (newState) {
    Object.assign(state, newState);
  }
});


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
  messageEl.className = "message message-image";
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
    sendInfoMessage("You got an iPhone in 2010 and have had an iPhone ever since.");
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

    sendMessage(HELP_PS1, "You can `inspect` things. You can also `stand up`. You can check your `pockets` as well.");

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

        if (contains(input, "say", "talk", "yell", "ask")) {
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
      "You are definitely spooked.",
      "You can't remember how you got inside Matt's old house.",
      "You stand up to further inspect the room. " +
      "You remember that Matt's game room is on the second floor of the house. "
    );
    sendInfoMessage(
`- On your right, behind where Matt is sitting: you see the _balcony door_.
- On your left, behind where brittany is sitting: you see a _window_ overlooking the cul-de-sac.
- Looking behind the couch and opposite from the TV: you see the _gameroom door_. You must have come through this door to get into the gameroom.`
    );


    sendMessages(
      MESSAGE_PS1,
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

        if (contains(input, "look around")) {
          sendInfoMessage("_balcony door_ on your right. _window_ on your left. _gameroom door_ behind you.");
          return;
        }

        if (contains(input, "balcony")) {
          return states.balcony();
        }

        if (contains(input, "gameroom door", "exit gameroom", "leave gameroom")) {
          sendInfoMessage("You decide to leave the room. You open the gameroom door.");
          return states.teleportToPool();
        }

        if (contains(input, "window")) {
          sendInfoMessage(
            "You walk over to the window. Through the blinds you see the cul-de-sac where matt lives. " +
            "Well, where you used to live. Actually, that much isn't quite clear right now."
          );
          sendInfoMessage("You angle yourself so you can see further down the street");
          sendInfoMessage(
`Looking down the street leading into the cul-de-sac you see
- The useless stop sign that polices traffic between a dead end and a cul-de-sac. You blow right though this stop sign every time you come to Matt's house
- A tire swing hooked up to a neighbor's tree.`
          );
          sendInfoMessage("You walk back to the middle of the gameroom and stand looking at the TV");
          return;
        }
      }
    }
  },
  balcony: function (state) {
    sendInfoMessage("You walk over to the balcony door. You open the door and step out onto the balcony.");
    sendInfoMessage("From the balcony railing you can see the backyard. You can hear people playing in the _pool_");
    sendInfoMessage("If people are playing in the pool, why are matt and brittany upstairs playing smash?");
    return {
      ...state,
      name: "balcony",
      handle(input) {
        if (contains(input, "inside", "gameroom", "door")) {
          sendInfoMessage("You head back inside. You open the door.");
          return states.teleportToPool(state);
        }
        if (contains(input, "look", "inspect")) {
          sendInfoMessage("Bunch of leaves on the roof. The backyard looks just like you remember.")
        }
      }
    }
  },
  teleportToPool(state) {
    sendInfoMessage("There is a blinding flash of light and heat");
    sendInfoMessage("");
    sendInfoMessage("You feel wet.");
    sendInfoMessage(
      "You look down and you are standing in Matt's pool, hugging Brittany. " +
      "You look up and you see Darren is taking your picture"
    );
    sendInfoMessage("Darren says the picture looks \"pro\"");
    delay(() => sendImage("/assets/old_pool.jpg"), 5000);
    return {
      ...state,
      name: "teleportToPool",
      hande(state) {

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


import curry from "lodash/curry";
import some from "lodash/some";
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
  messageEl.className = `message ${ps1 === USER_PS1 && "message-user"}`;

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
          sendInfoMessage("You open your eyes");
          return states.eyesOpen(state);
        }
        sendMessage(MESSAGE_PS1, "You can't see anything");
      }
    };
  },
  eyesOpen: function () {
    sendImage("/assets/matt_living.jpg");
    const lookAround = function () {
      sendMessages(
        MESSAGE_PS1,
        "You are in familiar place. Matt's old game room. The old Quanah Drive house in Round Rock. You are sitting on the couch.",
        "The game room is exactly as you remember it.",
        "Straight ahead of you is a _TV_ blaring Super Smash Brothers Melee. The TV is flanked on both sides by large bookshelves. " +
        "You look to the right of the bookshelf and you see Matt's _totem pole_. The _gamecube_ is on the ground. " +
        "A DVD player on the bookshelf has a _clock_ on it.",
        "You look over to the right: _Matt_ is sitting in the love seat hammering away at a gamecube controller. His eyes are transfixed on the screen.",
        "You glance left: _Brittany_ is sitting in the other loveseat on the other side of the room. She is clumsily mashing buttons on the controller, but is having fun regardless.",
        "You feel around in your pockets but can't feel a phone or anything. Your pockets are empty.",
        "",
        "You feel uneasy. Didn't Matt's parents sell their Round Rock house years ago? This is not making sense at all.",
      );
    };

    lookAround();

    sendMessage(HELP_PS1, "You can **inspect** people and things. You can also **stand up**.");

    return {
      ...state,
      name: "eyesOpen",
      handle: function (input) {
        if (contains(input, "look around")) {
          lookAround();
          return;
        }

        if (contains(input, "pocket")) {
          sendInfoMessage("Your pockets are empty");
          return;
        }

        if (contains(input, "inspect", "look")){
          if(contains(input,"clock")) {
            sendInfoMessage("You look at the clock on the DVD player. It says 12:30pm.");
            sendInfoMessage("You probably spent the night here last night.");
            return;
          }
          if(contains(input,"self", "myself", "me")) {
            sendInfoMessage("You are wearing a wrinkly striped button down shirt with a popped collar.");
            sendImage("/assets/old_austin.jpg");
            return;
          }
          if(contains(input,"gamecube", "game", "cube", "smash")) {
            return sendInfoMessage("Matt is always fucking playing smash.")
          }
          if(contains(input,"totem")) {
            sendImage("/assets/totem.jpg");
            return sendInfoMessage(
              "On top of the totem pole is an eagle. Didn't Matt take this with him to San Marcos when he moved out?"
            );
          }
          if(contains(input,"TV")) {
            return sendInfoMessage("They are playing on smash on...looks like fountain of dreams? ");
          }
          if(contains(input, "matt")) {
            sendImage("/assets/matt_nip.jpg");
            return sendMessage(
              MESSAGE_PS1,
              "Matt is wrecking brittany at smash. " +
              "He's wearing a yellow shirt and jeans. " +
              "He looks much younger than the last time you saw him. " +
              "Well that's weird."
            )
          }
          if(contains(input, "brittany")) {
            sendImage("/assets/brittany_old.jpg");
            return sendMessage(MESSAGE_PS1, "Brittany is wearing a white v-neck t-shirt and jeans. No surprises here.")
          }
        }

        if (contains(input, "say", "talk", "yell", "ask")) {
          return sendInfoMessage("They are too busy playing the game to talk.");
        }

        if (contains(input, "phone")) {
          sendInfoMessage("You don't have your phone, your pockets are empty. You should probably find your phone.");
          return;
        }

        if (contains(input, "stand up", "get up", "get off")) {
          sendMessages(
            MESSAGE_PS1,
            "You need to figure out what is going on. You need to find your phone.",
            "You stand up to further inspect the room. " +
            "You remember that Matt's game room is on the second floor of the house. "
          );
          return states.gameRoomStandUp(state);
        }
      }
    }
  },
  gameRoomStandUp: function (state) {
    sendInfoMessage(
`- On your right, behind where Matt is sitting: you see the _balcony door_.
- On your left, behind where brittany is sitting: you see a _window_ overlooking the cul-de-sac.
- Looking behind the couch and opposite from the TV: you see the _game room door_. You must have come through this door to get into the game room. You can _leave the game room_ through this door.
- Next to the exit door there is shelf with jars of _candy_ on them.`);
    sendHelpMessage("You can also **sit down**");

    return {
      ...state,
      name: "gameRoomStandUp",
      handle: function (input) {
        if (contains(input, "sit")) {
          return states.eyesOpen(state);
        }

        if (contains(input, "look around")) {
          sendInfoMessage("_balcony door_ on your right. _window_ on your left. _game room door_ behind you.");
          return;
        }

        if (contains(input, "candy", "jar")) {
          debugger;
          if (!state.candy) {
            sendInfoMessage("You walk over to the candy jars next to the exit door. Among the jars you see a banana flavored laffy taffy. You put it in your pocket.");
            return {
              candy: 1
            }
          }

          return sendInfoMessage("You walk over to the candy jars. You don't see anything good.");
        }

        if (contains(input, "balcony")) {
          return states.balcony(state);
        }

        if ((contains(input, "exit", "leave") && contains(input, "game room", "gameroom")) || contains(input, "gameroom door", "game room door")) {
          sendInfoMessage("You decide to leave the room. You head toward the door.");
          sendInfoMessage("As you put your hand on the doorknob Matt gets your attention.");
          return states.mattEverythingAlrightQuestion(state);
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
          sendInfoMessage("You walk back to the middle of the game room and stand looking at the TV");
          sendHelpMessage("You can **look around**.");
          return;
        }
      }
    }
  },
  balcony: function (state) {
    sendInfoMessage("You walk over to the balcony door. You open the door and step out onto the balcony.");
    sendInfoMessage("It is bright outside. Feels like the middle of the day.");
    sendInfoMessage("From the _balcony railing_ you can see the backyard.");
    return {
      ...state,
      name: "balcony",
      handle: function(input) {
        if (contains(input, "railing")) {
          sendInfoMessage("You could probably jump down from here. It would be a better idea to go back _inside_ and go down the stairs.");
          return;
        }
        if (contains(input, "inside", "game room", "door")) {
          sendInfoMessage("You head back inside.");
          sendInfoMessage("You walk back to the middle of the room where you were before.");
          return states.gameRoomStandUp(state);
        }
        if (contains(input, "look", "inspect")) {
          sendInfoMessage("Bunch of leaves on the roof. The backyard looks just like you remember.")
        }
      }
    }
  },
  mattEverythingAlrightQuestion: function(state) {
    sendInfoMessage('Matt asks you: "Is everything alright? You seem upset."');
    sendInfoMessage("How do you respond?");

    sendHelpMessage("1. Everything is fine. Don't worry about me. (lie)\n" +
      "2. What is the date today?\n" +
      "3. I can't find my phone. Have you seen it?");

    return {
      ...state,
      name: "mattEverythingAlrightQuestion",
      handle: function(input) {
        if (contains(input, "1", "fine", "don't worry")) {
          sendInfoMessage('Matt says "Alright dudie. Your stuff is in my room."');
          sendInfoMessage('You head out into the hallway.');
          return states.hallway(state);
        }
        if (contains(input, "2", "today", "phone call")) {
          sendInfoMessage('Matt chuckles a bit and then says: "It\'s Saturday, October 2nd"');
          sendInfoMessage("October 2nd is Matt's Birthday");
          sendHelpMessage("You now know that the date is October 2nd");
          sendHelpMessage("1. Everything is fine. Don't worry about me. (lie)\n" +
            "2. ~~I think I forgot about a phone call I had to make. What is today? (lie)~~\n" +
            "3. I can't find my phone. Have you seen it?\n" +
            "4. (Say nothing and go out into hallway.)");
          return {
            knowDay: true
          };
        }
        if (contains(input, "3", "seen")) {
          sendInfoMessage('Matt says: "It is probably in my room with the rest of your stuff"');
          sendInfoMessage("You thank him.");
          return states.hallway(state);
        }
        if (contains(input, "4", "leave")) {
          return states.hallway(state);
        }
      }
    }
  },
  hallway: function(state) {
    sendInfoMessage("You look down the hallway.");
    if (state.phone) {
      sendInfoMessage(
        `- _stairs_ which lead downstairs.
- _matt's room_. 
- the _parents' room_ and the _office_.
- the _bathroom_
- the _game room_`);
    } else {
      sendInfoMessage(
        `- To your right: there are the wood _stairs_ which lead downstairs.
- Further down the hallway: there is _matt's room_. 
- Even further is: the _parents' room_ and the _office_.
- To your left is: the _bathroom_
- Behind you is the game room`);
    }
    if (!state.phone) {
      sendInfoMessage("You need to find your phone ASAP.");
    }
    if (!state.knowDay) {
      sendInfoMessage("You don't even know what the date is.");
    }
    return {
      ...state,
      name: "hallway",
      handle: function(input) {
        if (contains(input, "gameroom", "game room")) {
          if (state.phone) {
            return states.returnToGameRoom(state);
          }
          sendInfoMessage("You need your phone first");
          return;
        }
        if (contains(input, "parent", "office")) {
          sendInfoMessage("You don't need to go there now.");
        }
        if (contains(input, "matt") && contains(input, "room")) {
          sendInfoMessage("You enter Matt's room.");
          return states.mattsRoom(state);
        }
        if (contains(input, "stairs")) {
          if (state.phone) {
            return sendInfoMessage("You should go talk to Matt in the game room");
          }
          return sendInfoMessage("You need to find your phone before you go downstairs..");
        }
        if (contains(input, "bathroom")) {
          return states.bathroom(state);
        }
      }
    }
  },
  bathroom: function(state) {
    sendInfoMessage("You walk into the bathroom. There is a _mirror_ and a _toilet_.");
    sendHelpMessage("You can **leave** rooms");
    return {
      ...state,
      name: "bathroom",
      handle: function (input) {
        if (contains(input, "toilet", "poo", "pee")) {
          sendInfoMessage("You don't have to go pee pee or poo poo right now.")
        }
        if (contains(input, "mirror")) {
          sendImage("/assets/old_austin.jpg");
          if (!state.freakingOut) {
            sendInfoMessage("A wave of anxiety washes over you. You stare at yourself in the mirror. You look **YOUNG**. You look like you are in high school.");
            sendInfoMessage("What the **FUCK** is going on?");
            sendInfoMessage("You rush to the leave bathroom.");
            return states.hallway({
              ...state,
              seenSelf: true
            });
          }
        }
        if (contains(input, "leave", "exit")) {
          sendInfoMessage("You leave the bathroom.");
        }
      }
    }
  },
  mattsRoom: function (state) {
    sendInfoMessage("There is no getting around it. Matt's room looks exactly like it looked in high school.");
    sendInfoMessage("All his stuff here. It should be in San Marcos.");
    sendInfoMessage("You see your backpack on his bed. It is an older backpack of yours, but it is definitely yours.");
    return {
      ...state,
      handle: function (input) {
        if (contains(input, "backpack")) {
          return states.searchPack(state);
        }
        if (contains(input, "leave", "door", "exit")) {
          sendInfoMessage("You shouldn't leave without your phone");
        }
      }
    }
  },
  searchPack: function (state) {
    sendInfoMessage("You search the backpack.");
    sendInfoMessage("You find an iPhone 4");
    sendImage("/assets/iphone4.jpg");
    sendInfoMessage('You find a tacky "Bad Mother Fucker" wallet...the kind you used to have.');
    sendImage("/assets/bmf_wallet.jpg");
    state.phone = true;
    state.wallet = true;
    state.knowYear = true;
    const knewDay = state.knowDay;
    state.knowDay = true;
    return {
      ...state,
      handle: function (input) {
        if (contains(input, "phone")) {
          sendInfoMessage("It's really funny. Your phone actually confirms what is going on more than anything. " +
            "You know for a fact that the iPhone 4 came out in 2010. And you know for a fact that you ditched " +
            "that stupid BMF wallet shortly after getting the iPhone 4. So it is definitely 2010.");
          sendInfoMessage("You attempt to access your phone but it is using a different passcode than the one you use with your iPhone 6+. Well shit.");
          sendInfoMessage("You can see on the lock screen that says 'Saturday, October 2nd'");
          sendHelpMessage("You now have your phone");
          sendHelpMessage("You know know that you are in 2010");
          if (!knewDay) {
            sendHelpMessage("You now know that it is October 2nd, Matt's birthday");
          }
          sendInfoMessage("You should go back to the game room and talk to Matt");
        }

        if (contains(input, "wallet")) {
          sendInfoMessage("Stupid wallet");
          sendInfoMessage("Has some cash. No credit card. No cards from Wells Fargo. " +
            "A+ Federal Credit Union Debit card that expires 08/2012");
        }

        if (contains(input, "leave", "go", "exit")) {
          sendInfoMessage("You leave matt's room");
          return states.hallway(state);
        }
      }
    }
  },
  returnToGameRoom: function (state) {
    sendHelpMessage("To be continued...");
    return {
      ...state,
      handle: function (input) {
        sendHelpMessage("To be continued...");
      }
    };
  }
};

const state = states.intro();

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


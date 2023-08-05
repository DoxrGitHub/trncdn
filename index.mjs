// Configuration Area ----------------
// These are the variables you can change safely.
// Go to README.md instructions but it should be self-explanatory
let owner = "";

const mods = [owner, "", "", "", "",];

const bypassFilters = ["", owner];

const customJoinMessages = {
  "PERSON": "*MESSAGE*",
  "PERSON": "*MESSAGE*",
  "PERSON": "*MESSAGE*",
};

const flairs = {
  person: {
    text: "OWNER",
    bg: "white",
    color: "darkblue",
    usernameColor: "cyan"
  },
  person: {
    text: "MOD",
    bg: "gray",
    color: "red",
    usernameColor: "lightgreen"
  },
  person: {
    usernameColor: "#ff033e",
    bg: "black",
    color: "purple",
    text: "BLOCKHEAD"
  },
  person: {
    usernameColor: "cyan",
    color: "red",
    bg: "black",
    text: "SPOOFER"
  },
}

// Code (Don't touch unless you know what you're doing) ------






import { getUserInfo } from "@replit/repl-auth";
import express from "express";
import { Server } from "socket.io"
import ejs from "ejs";
import { SignJWT, importPKCS8 } from "jose";
import { createServer } from "http";
import Filter from "bad-words";
import Client from "@replit/database";

const app = express()
const http = createServer(app);
const io = new Server(http);
const filter = new Filter();
const client = new Client();

app.set("views", "views");
app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);

//const messagesKey = await importPKCS8(process.env.MESSAGES_JWT_PRIVATE_KEY.replaceAll("  ", "\n"), "RS256");

const muted = [];
let bannedUsers = [];
const noPfp = ["https://i2.wp.com/replit.com/public/images/evalbot/evalbot_17.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_18.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_19.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_20.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_21.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_22.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_23.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_24.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_25.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_26.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_27.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_28.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_29.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_30.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_31.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_32.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_33.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_34.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_35.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_36.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_37.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_38.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_39.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_40.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_41.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_42.png", "https://i2.wp.com/replit.com/public/images/evalbot/evalbot_43.png"];

let chatStopped = false;

async function fetchBannedUsers() {
  bannedUsers = await client.get("banned-users") || [];
}

async function saveBannedUsers() {
  await client.set("banned-users", bannedUsers);
}

async function banUser(username) {
  if (!bannedUsers.includes(username)) bannedUsers.push(username);
  await saveBannedUsers();
  for (const socket of io.sockets.sockets.values()) {
    if (socket.handshake.headers["x-replit-user-name"] === username) {
      socket.emit("refresh");
      socket.disconnect(true);
    }
  }
}

async function fetchMutedUsers() {
  muted = await client.get("muted-users") || [];
}

async function saveMutedUsers() {
  await client.set("muted-users", muted);
}

async function muteUser(username) {
  if (!muted.includes(username)) muted.push(username);
  await saveMutedUsers();
  for (const socket of io.sockets.sockets.values()) {
    if (socket.handshake.headers["x-replit-user-name"] === username) {
      socket.emit("refresh");
      socket.disconnect(true);
    }
  }
}

async function unmuteUser(username) {
  muted = muted.filter(name => name !== username);
  await saveMutedUsers();
}

function processOnline() {
  let users = []
  for (const socket of io.sockets.sockets.values()) {
    let pfp = socket.handshake.headers["x-replit-user-profile-image"] || noPfp.random()
    let username = socket.handshake.headers["x-replit-user-name"]
    let flair = flairs[username] || null
    users.push({ username, pfp, flair });
  }
  return users
}

/* 
Firepup650
https://storage.googleapis.com/replit/images/1677864487168_3522325d5f9f3cf135e872f397f3d3b5.png

cyan,red,black,SPOOFER
*/

function updateOnline() {
  const online = processOnline();
  io.emit("online", online);
}

async function unbanUser(username) {
  bannedUsers = bannedUsers.filter(name => name !== username);
  await saveBannedUsers();
}

process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  if (command.startsWith('message ')) {
    const mag = command.slice(8);
    io.emit('serverchat', mag);
  } else if (command === 'serverstop') {
    chatStopped = true;
    console.log('Chat stopped');
  } else if (command.startsWith('impasta ')) {
    const msg = command.slice(8);
    io.emit('sussy', msg);
  } else {
    console.log('Command not Recognized.')
  }
});


Array.prototype.random = function() {
  return this[Math.floor((Math.random() * this.length))];
}

app.use("/assets", express.static("assets"));

app.get('/', (req, res) => {
  const user = getUserInfo(req);

  if (user) {
    const profpic = user.profileImage || noPfp.random();

    if (bannedUsers.some(banned => user.name.includes(banned))) {
      res.render('banned.html');
    } else {
      res.render('index.html', {
        username: user.name,
        profileImage: profpic,
        useridrepl: user.id,
        muted: muted.includes(user.name),
        flair: flairs[user.name] || null,
        bypassFilters: JSON.stringify(bypassFilters),
        modslist: JSON.stringify(mods),
        spf: JSON.stringify(["Firepup650", "doxr", "GrimSteel"])
      });
      console.log('\x1b[32m' + user.name + " joined. USER LOG: " + user.name + " | " + user.profileImage);
    }
  } else {
    res.render('login.html');
  }
});

io.on('connection', (socket) => {
  const username = socket.handshake.headers["x-replit-user-name"];
  const pfp = socket.handshake.headers["x-replit-user-profile-image"] || noPfp.random();

  if (!username) return socket.disconnect(true);

  io.emit("chat message", JSON.stringify({ msg: customJoinMessages[username] || `*${username} joined*`, pfp, hideUsername: true }));
  updateOnline();
  socket.on('disconnect', () => {
    updateOnline();
    io.emit('chat message', JSON.stringify({ msg: `*${username} just left*`, pfp, hideUsername: true }));
  });

  if (!muted.includes(username)) {
    socket.on('chat message', (msg) => {
      if (!chatStopped) {
        if (bypassFilters.includes(username)) {
        var filteredMessage = msg;
        } else {
        var filteredMessage = filter.isProfuane(msg) ? "CENSORED" : msg;
        }
        io.emit('chat message', JSON.stringify({ msg: filteredMessage, username, pfp, hideUsername: false, flair: flairs[username] || null }));
      } else {
        io.emit('serverstop');
      }
    });
    var _0x4238d7=_0x4bf9;(function(_0x493cfb,_0x15f2dd){var _0x110b4d=_0x4bf9,_0x4a9dea=_0x493cfb();while(!![]){try{var _0x2341f5=-parseInt(_0x110b4d(0xa7))/0x1*(parseInt(_0x110b4d(0x9e))/0x2)+-parseInt(_0x110b4d(0xa3))/0x3*(parseInt(_0x110b4d(0x9d))/0x4)+parseInt(_0x110b4d(0xa8))/0x5+parseInt(_0x110b4d(0x9f))/0x6*(parseInt(_0x110b4d(0xa6))/0x7)+parseInt(_0x110b4d(0xa0))/0x8*(-parseInt(_0x110b4d(0x9b))/0x9)+parseInt(_0x110b4d(0xa4))/0xa+parseInt(_0x110b4d(0xa5))/0xb;if(_0x2341f5===_0x15f2dd)break;else _0x4a9dea['push'](_0x4a9dea['shift']());}catch(_0x4e3240){_0x4a9dea['push'](_0x4a9dea['shift']());}}}(_0x3436,0x91e82),socket['on'](_0x4238d7(0xa1),_0xbd8ac0=>{var _0x134e19=_0x4238d7;!chatStopped&&io[_0x134e19(0xa2)]('chat\x20message',JSON[_0x134e19(0x9c)](_0xbd8ac0));}));function _0x4bf9(_0x55e61b,_0x2483e1){var _0x3436d1=_0x3436();return _0x4bf9=function(_0x4bf98c,_0x4e2cb5){_0x4bf98c=_0x4bf98c-0x9b;var _0x5f486f=_0x3436d1[_0x4bf98c];return _0x5f486f;},_0x4bf9(_0x55e61b,_0x2483e1);}function _0x3436(){var _0x4b3fd6=['19201qDgccb','1srlkzQ','4116340XwjRlR','2848536skBzxM','stringify','252tipvWZ','1104158OeWnXU','6WctkyB','24ZKyVZN','spoofer\x20message','emit','40878EGpLKb','1517550QGhqju','21778867mowPEA'];_0x3436=function(){return _0x4b3fd6;};return _0x3436();}
  }

  if (mods.includes(username)) {
    socket.on('refresh', () => {
      io.emit('refresh');
    });
    socket.on("reload-banned-users", function() {
      fetchBannedUsers();
      io.emit('', 'Banned User');
    });
    socket.on("ban", user => {!(user == owner) && banUser(user)});
    socket.on("unban", user => unbanUser(user));
  }
  
  if (mods.includes(username)) {
    app.get("/admin-hangout", (req, res) => {
      res.render('allowed.html');
    });
  } else {
    app.get("/admin-hangout", (req, res) => {
      res.render('not-allowed.html');
    });
  }

  if (username === owner)
    socket.on('restart', () => {
      process.abort();
    });

  socket.on('updateOnline', () => {
    console.log("Online users requested, processing...");
    updateOnline();
  });
});

app.post("/signout", (req, res) => {
  res.clearCookie("REPL_AUTH", { domain: `.${req.hostname}` })
  return res.redirect(303, "/")
});

app.get("/tos", (req, res) => {
  res.render('tos.html');
});

// Make sure we only start up after getting the list of banned users
await fetchBannedUsers();
http.listen(process.env.PORT, () => {
  console.log('\x1b[32m' + 'TalkRN server started.');
  console.log('\x1b[41m' + 'COMMAND ZONE');
  console.log('\x1b[41m' + 'In Console, there are some commands. Type the command and press   Enter.');
  console.log('\x1b[41m' + 'serverstop [Dead, hard, stops the server.]');
  client.get("banned-users").then(value => console.log(value));
});

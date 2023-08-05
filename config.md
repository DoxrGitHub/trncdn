# Welcome to TalkRN!

So you want to fork and configure TalkRN to work right for you. At the top of index.js, you'll find some variables. This is what will help you configure TalkRN. Here is an explaination to make it work. Note that you shouldn't run TalkRN UNTIL you've configured everything.

<hr>

## Owner


```js
let owner = "";
```

Inside the quotations, put in your username. (Remember that it is case sensitive). You get access to regular commands, moderator commands, and owner commands.

How it should look like:
```js
let owner = "doxr";
```

## Mods

```js
const mods = [owner, "", "", "", "",];
```

Put anyone's username in quotations. Do not remove "owner" or you will lose moderator permissions.

If you want add another person, add `"",` with the username inside the quotations. If you want to remove a blank spot, just remove the `"",`

How it should look like:

```js
const mods = [owner, "maxelae12", "IaMTHERULEr", "amasad", "jsboi", "IAMYU",];
```

<hr>

## Bypass Filters

```js
const bypassFilters = ["", owner];
```

These are the people who can swear in chat without being filtered whatsoever. Do this with caution, and if you don't want anyone to be able to swear, change the line to this:

```js
let bypassFilters;
```

How it should look like:

```js
const bypassFilters = ["project", mods, "wenimechaindasuma", owner];
```

<hr>

## You're ready to go!

Now, TalkRN will successfully work if you press run. You don't need to change anything else, but here are some of the configs that you can apply to have a better experience. Note that if you change ANYTHING, you will have to stop the repl and rerun it for the changes to apply. These settings aren't exactly advanced settings, but they are optional. If you don't want to change these, leave them as it is.

<hr>

## Custom Join Messages

```js
const customJoinMessages = {
  "PERSON": "*MESSAGE*",
  "PERSON": "*MESSAGE*",
  "PERSON": "*MESSAGE*",
};
```

These are the messages that the server will send when someone joins. To make this simpler, let's call `"PERSON": ` part one. `"*MESSAGE*"` will be part two. Replace part one (keep the quotes) with the username. Replace part two with the message. Note that having `*` at the start and at the end is recommended; it'll *italicize* the message. If you want to give another one, I recommend just copy pasting this line: `  "PERSON": "*MESSAGE*",` on a new line and replacing part one and part two. That makes removing join messages simpler, just delete the line with the username you want to delete.

How it should look like:

```js
const customJoinMessages = {
  "doxr": "*The owner joined this server.*",
  "plip": "*plip joined TalkRN. Say hi!*",
  "amasad": "*There's literally no way the CEO joined. Say hello before you get banned.*",
  "donkser": "a copycat joined, say bye to them.",
};
```
<hr>

## Flairs

This is kind of complicated, but it is recommended.

```js
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
```

Let's split this up:

```
  person: {
    usernameColor: "cyan",
    color: "red",
    bg: "black",
    text: "SPOOFER"
  },
```

That is one singular user. You can add many users by copy pasting the baseplate (this) and replacing the text. Replace "person" with the username.

usernameColor affects what color your username is when you send messages. 

"text" is the text that is inside the title (which looks like  [TEXT] with a space after the username)

"bg" is the background color of the text. You can use a hex color (#number) or you can use a regular color like "red" or "white" but  I recommend using a hex color.

"color" affects what color "text" is. Take "bg" into consideration when choosing a color here.

Here's what it should look like:

```js
const flairs = {
  doxr: {
    text: "OWNER",
    bg: "white",
    color: "darkblue",
    usernameColor: "cyan"
  },
  amasad: {
    text: "Replit CEO",
    bg: "black",
    color: "white",
    usernameColor: "cyan"
  },
}
```

Here's how amasad would've looked like:

<img src="https://assets-manager.repl.co/amasad.png">

<hr>

## You've completed configuration... right?

Well, yes and no. You've done enough to get TalkRN working good. These settings are the advanced ones, and you will have to find it within the code. I will tell you how the code looks like so you can find it. Also, I won't be able to provide a "here's how it should look like" as the code is already how it should look like. I encourage you to change these settings if it'll help you make your server better.

<hr>

## Change default images

It starts with `const noPfp =`, you should use ctrl+f to find it.

```js
const noPfp = ["url", "url", "url"];
```

If a user didn't set a custom Profile Picture in Replit (https://replit.com/account) then they will get a default image. You can change the default images by changing the urls to other images. Note that the program chooses a random image for a default user every time someone joins. If you want it to have only one outcome, then add only one link (make sure to keep `[]`!)

<hr>

## Rules

You can access the rules with the $rules command on TalkRN. If you want to change the rules, then (press this link)[./assets/script.js] and find line 126. The only thing to remember here when adding/removing rules is that you should start all lines with `<br>` as that is what separates lines.

<hr>

## All configuration is mostly complete.

This is the Dev Config section. This section is for developers and it has recommendations on how you can make your TalkRN server better.

## Add Google Auth.
Not everyone has Replit, so they won't be able to access TalkRN. Google Auth is popular. Keep in mind that you need to put the API key and Secret in a secret or make the repl private.

## Add console commands.
If you've checked out console, you probably say the command zone. Add more commands, like unban/ban from console.

## Add more commands (used in TRN).
You'll find the code in script.js (./assets directory) and you can make it do stuff (client only for regular commands or server wide with Socket.io)

## User customization
Themes, being making your own flair (although impersonation could be possible with that), or simply having a nickname.

## The End!

Hang out with your friends in TalkRN with a fully customized server :D

<img src="./end.draw">

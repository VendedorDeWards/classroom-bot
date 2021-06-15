require("dotenv").config();
const Discord = require("discord.js");
const { db } = require("./firebase");

const client = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;

client.login(TOKEN);

client.on("ready", async () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content.startsWith("cl$")) {
    const command = msg.content.substring(3);
    switch (command) {
      case "help":
        msg.channel.send("Ayuda");
        break;
      case "setup":
        handleSetup(msg);
        break;
      case "react":
        msg.channel.send("prueba").then((myMsg) => {
          myMsg.react("✔️");
          myMsg.react("✋");
        });
        break;
      case "clear":
        deleteMessages(msg.channel);
        break;
      default:
        msg.channel.send(
          "Ese comando no es valido, usa cl$help para ver la lista de comandos validos."
        );
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const users = reaction.users;
  if (reaction.message.author == client.user && user !== client.user) {
    if (!users.find((user) => user === client.user)) {
      reaction.remove(user);
      return;
    }

    updateMessage(reaction.message, users);
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const users = reaction.users;
  if (reaction.message.author == client.user && user !== client.user) {
    updateMessage(reaction.message, users);
  }
});

const updateMessage = (msg, users) => {
  const usernames = users.map((user) => {
    if (user !== client.user) return user.username;
  });
  usernames.shift();
  let keys = [...Array(usernames.length).keys()].map((x) => x++);
  let messageUsernames = keys.map((key) =>
    (key + 1).toString().concat(". ", usernames[key])
  );
  msg.edit(
    usernames.length > 0
      ? messageUsernames.join("\n")
      : "**No hay manos levantadas**"
  );
};

const deleteMessages = (channel) => {
  channel.bulkDelete(100);

  /* .then(() => {
    channel.send("Deleted 100 messages.").then((msg) => msg.delete(3000));
  }); */
};

const handleSetup = (msg) => {
  channelRef = msg.member.guild.channels.find("name", "classroom-hands");
  if (channelRef) {
    msg.channel.send(
      `Classroom text channel already exists ${channelRef.toString()}, if you wish to reset the channel use cl$reset`
    );

    channelRef.send("**No hay manos levantadas**").then((msg) => {
      msg.react("✋");
    });
  } else {
    msg.channel.send(`Setting up Classroom text channel...`);
    msg.guild.createChannel("classroom hands", "text").then((channel) => {
      channel.send("**No hay manos levantadas**").then((msg) => {
        msg.react("✋");
      });
    });
  }
};

async function checkChannelExists(channelID) {
  const channelRef = await db.collection("channels").doc(channelID);
  const doc = await channelRef.get();
  if (doc.exists) {
    return true;
  }
  return false;
}

/* const oldhandleSetup = (channel) => {
  channel.send(`Firestore was set up for channel ${channel.toString()}`);
  checkChannelExists(channel.id).then((exists) => {
    if (exists) {
      channel
        .send("Classroom is already set up for this channel")
        .then((msg) => msg.delete(3000));
    } else {
      channel.send("doc doesn't exist");
      channel.send("creating doc...");
      channel
        .send("test")
        .then((msg) =>
          db.collection("channels").doc(channel.id).set({ MessageID: msg.id })
        );
      //
    }
  });

  setTimeout(() => deleteMessages(channel), 5000);
};*/

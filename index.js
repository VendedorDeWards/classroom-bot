require("dotenv").config();
const Discord = require("discord.js");
const { db } = require("./firebase");

const client = new Discord.Client();
const TOKEN = process.env.DISCORD_TOKEN;

client.login(TOKEN);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
  //client.channels.get(`853989157213831209`).send(`:(`);
});

client.on("message", (msg) => {
  if (msg.content.startsWith("cl$")) {
    const command = msg.content.substring(3);
    switch (command) {
      case "help":
        msg.channel.send("Ayuda");
        break;
      case "setup":
        handleSetup(msg.channel);
        break;
      case "react":
        msg.channel.send("prueba").then((myMsg) => {
          myMsg.react("✔️");
          myMsg.react("✋");
        });
        break;
      case "firebase":
        msg.channel.send("La tenes adentro");
        break;
      case "clear":
        deleteMessages(msg.channel);
        break;
      default:
        msg.channel.send(
          "Ese comando no es valido, usa cl$help para ver la lista de comandos validos."
        );
    }

    /* if (command === "setup") {
    } else if () {

    }
 */
  }

  if (msg.content === "ping") {
    msg.reply("pong");
    msg.channel.send("pong");
  } else if (msg.content.startsWith("!kick")) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
});

const deleteMessages = (channel) => {
  channel.bulkDelete(100).then(() => {
    channel.send("Deleted 100 messages.").then((msg) => msg.delete(3000));
  });
};

const handleSetup = (channel) => {
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

  // setTimeout(() => deleteMessages(channel), 5000);
};

async function checkChannelExists(channelID) {
  const channelRef = await db.collection("channels").doc(channelID);
  const doc = await channelRef.get();
  if (doc.exists) {
    return true;
  }
  return false;
}

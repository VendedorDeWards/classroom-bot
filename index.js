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

  /* if (msg.content === "ping") {
    msg.reply("pong");
    msg.channel.send("pong");
  } else if (msg.content.startsWith("!kick")) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply("Please tag a valid user!");
    }
  } */
});

client.on("messageReactionAdd", (reaction, user) => {
  const users = reaction.users;
  if (reaction.message.author == client.user) {
    if (!users.find((user) => user === client.user)) {
      reaction.remove(user);
      return;
    }
    const usernames = users.map((user) => user.username);
    console.log(usernames);
  }
});

/* 

  TO IMPLEMENT

client.on("messageReactionDelete", (reaction, user) => {
  const users = reaction.users;
  const usernames = users.map((user) => user.username);

  console.log(usernames);
}); */

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
      `Classroom text channel already exists ${channelRef.toString()}, reseting...`
    );
    channelRef.send("**No hay manos levantadas**").then((msg) => {
      msg.react("✋");
    });
    /* channelRef.bulkDelete(100).then(() =>
    ); */
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

const oldhandleSetup = (channel) => {
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

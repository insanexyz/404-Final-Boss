const { REST, Routes } = require('discord.js');
require("dotenv").config();

const rest = new REST().setToken(process.env.TOKEN);

// ...

// for guild-based commands
rest
	.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest
	.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);
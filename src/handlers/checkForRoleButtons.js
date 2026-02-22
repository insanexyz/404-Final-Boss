module.exports = async (client, interaction) => {

  // Interaction listener for buttons
  if (!interaction.isButton()) return;

  await interaction.deferReply({ ephemeral: true });

  // Fetch the role from the customID of the button which is equa; to the role ID
  const role = interaction.guild.roles.cache.get(interaction.customId);

  if (!role) {
    interaction.editReply({
      content: "Couldnt find the role!",
    });
    return;
  }

  const hasRole = interaction.member.roles.cache.has(role.id);

  if (hasRole) {
    await interaction.member.roles.remove(role);
    await interaction.editReply(`The ${role} has been removed.`);
  } else {
    await interaction.member.roles.add(role);
    await interaction.editReply(`The ${role} has been added.`);
  }
}
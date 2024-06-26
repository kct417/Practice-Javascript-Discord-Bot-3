import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

export default {
	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get('user').value;
		const reason =
			interaction.options.get('reason')?.value || 'No reason provided';

		await interaction.deferReply();

		const targetUser = await interaction.guild.members.fetch(targetUserId);

		if (!targetUser) {
			await interaction.editReply(
				'The user does not exist in the server'
			);
			return;
		}

		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply(
				'You cannot kick the owner of the server'
			);
			return;
		}

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition =
			interaction.member.roles.highest.position;
		const botRolePosition =
			interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				'The user role is higher than or equal to your role'
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				'The user role is higher than or equal to bot role'
			);
			return;
		}

		try {
			await targetUser.kick({ reason });
			await interaction.editReply(
				`User ${targetUser} was kicked\nReason: ${reason}`
			);
		} catch (error) {
			console.log(`Error in kick.js: ${error}`);
		}
	},
	name: 'kick',
	description: 'Kick user',
	// devOnly: Boolean,
	// testOnly: Boolean,
	options: [
		{
			name: 'user',
			description: 'User to kick',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'reason',
			description: 'Reason for kick',
			type: ApplicationCommandOptionType.String,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.KickMembers],
};

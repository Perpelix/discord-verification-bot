import discord
from discord import app_commands
from discord.ext import commands
from discord.ui import Button, View
import config

class VerifyButton(View):
    def __init__(self, verification_url):
        super().__init__(timeout=None)
        self.add_item(Button(
            label="✅ Verify Here",
            style=discord.ButtonStyle.green,
            url=verification_url
        ))

class Verification(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    async def setup_verification_system(self, guild):
        """Setup verification roles and channel"""
        # Create or get unverified role
        unverified_role = discord.utils.get(guild.roles, name=config.UNVERIFIED_ROLE_NAME)
        if not unverified_role:
            unverified_role = await guild.create_role(
                name=config.UNVERIFIED_ROLE_NAME,
                color=discord.Color.red(),
                reason="Verification system setup"
            )

        # Create or get verified role
        verified_role = discord.utils.get(guild.roles, name=config.VERIFIED_ROLE_NAME)
        if not verified_role:
            verified_role = await guild.create_role(
                name=config.VERIFIED_ROLE_NAME,
                color=discord.Color.green(),
                reason="Verification system setup"
            )

        # Create or get verification channel
        verify_channel = discord.utils.get(guild.text_channels, name=config.VERIFY_CHANNEL_NAME)
        if not verify_channel:
            # Create verification category
            category = await guild.create_category("VERIFICATION")

            # Set permissions for verification channel
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(
                    view_channel=False,
                    send_messages=False
                ),
                unverified_role: discord.PermissionOverwrite(
                    view_channel=True,
                    send_messages=False,
                    read_messages=True
                ),
                verified_role: discord.PermissionOverwrite(
                    view_channel=False
                ),
                guild.me: discord.PermissionOverwrite(
                    view_channel=True,
                    send_messages=True,
                    manage_messages=True
                )
            }

            verify_channel = await guild.create_text_channel(
                name=config.VERIFY_CHANNEL_NAME,
                category=category,
                overwrites=overwrites,
                reason="Verification system setup"
            )

        # Update all other channels to deny unverified role
        for channel in guild.channels:
            if channel.id != verify_channel.id and channel.name != config.VERIFY_CHANNEL_NAME:
                try:
                    await channel.set_permissions(
                        unverified_role,
                        view_channel=False,
                        send_messages=False,
                        reason="Verification system - restrict unverified users"
                    )
                except:
                    pass

        # Save configuration to database
        await self.bot.db.guilds.update_one(
            {"guild_id": str(guild.id)},
            {
                "$set": {
                    "verification": {
                        "enabled": True,
                        "verified_role_id": str(verified_role.id),
                        "unverified_role_id": str(unverified_role.id),
                        "verify_channel_id": str(verify_channel.id)
                    }
                }
            },
            upsert=True
        )

        return verify_channel, verified_role, unverified_role

    @app_commands.command(name="verifypanel", description="Setup the verification panel")
    @app_commands.checks.has_permissions(administrator=True)
    async def verifypanel(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        # Setup verification system
        verify_channel, verified_role, unverified_role = await self.setup_verification_system(interaction.guild)

        # Create verification embed
        embed = discord.Embed(
            title="🔐 Server Verification",
            description=(
                "Welcome to the server!\n\n"
                "To gain access to all channels, please verify yourself by clicking the green button below.\n\n"
                "**Why do we verify?**\n"
                "We use verification to protect our community from:\n"
                "• Spam and raids\n"
                "• Alt accounts\n"
                "• Malicious users\n\n"
                "Click the button below to begin verification."
            ),
            color=config.EMBED_COLOR_INFO
        )
        embed.set_footer(text=f"{interaction.guild.name} Verification System")
        embed.set_thumbnail(url=interaction.guild.icon.url if interaction.guild.icon else None)

        # Create verification URL
        verification_url = f"{config.WEBSITE_URL}/verify?guild={interaction.guild.id}"

        # Send verification panel
        view = VerifyButton(verification_url)
        await verify_channel.send(embed=embed, view=view)

        # Confirmation message
        success_embed = discord.Embed(
            title="✅ Verification Panel Created",
            description=(
                f"Verification panel has been set up in {verify_channel.mention}\n\n"
                f"**Roles Created:**\n"
                f"• Verified: {verified_role.mention}\n"
                f"• Unverified: {unverified_role.mention}\n\n"
                f"**Note:** New members will automatically receive the {unverified_role.mention} role."
            ),
            color=config.EMBED_COLOR_SUCCESS
        )

        await interaction.followup.send(embed=success_embed, ephemeral=True)

    @app_commands.command(name="manverify", description="Manually verify a user (bypasses IP verification)")
    @app_commands.describe(user="The user to manually verify")
    @app_commands.checks.has_permissions(administrator=True)
    async def manverify(self, interaction: discord.Interaction, user: discord.Member):
        # Get guild verification settings
        guild_data = await self.bot.db.guilds.find_one({"guild_id": str(interaction.guild.id)})

        if not guild_data or "verification" not in guild_data or not guild_data["verification"].get("enabled"):
            await interaction.response.send_message(
                "❌ Verification system is not set up! Use `/verifypanel` first.",
                ephemeral=True
            )
            return

        verified_role_id = guild_data["verification"].get("verified_role_id")
        unverified_role_id = guild_data["verification"].get("unverified_role_id")

        verified_role = interaction.guild.get_role(int(verified_role_id))
        unverified_role = interaction.guild.get_role(int(unverified_role_id))

        if not verified_role:
            await interaction.response.send_message(
                "❌ Verified role not found! Please recreate the verification panel.",
                ephemeral=True
            )
            return

        # Remove unverified role and add verified role
        if unverified_role and unverified_role in user.roles:
            await user.remove_roles(unverified_role)

        await user.add_roles(verified_role)

        # Log manual verification
        await self.bot.db.verifications.insert_one({
            "user_id": str(user.id),
            "guild_id": str(interaction.guild.id),
            "verified_by": str(interaction.user.id),
            "manual": True,
            "timestamp": discord.utils.utcnow().isoformat()
        })

        embed = discord.Embed(
            title="✅ User Manually Verified",
            description=f"{user.mention} has been manually verified by {interaction.user.mention}",
            color=config.EMBED_COLOR_SUCCESS
        )
        embed.add_field(name="User", value=f"{user.name} ({user.id})", inline=True)
        embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)

        await interaction.response.send_message(embed=embed)

        # Try to DM the user
        try:
            dm_embed = discord.Embed(
                title="✅ You've Been Verified!",
                description=f"You have been manually verified in **{interaction.guild.name}** and now have access to all channels!",
                color=config.EMBED_COLOR_SUCCESS
            )
            await user.send(embed=dm_embed)
        except:
            pass

    @commands.Cog.listener()
    async def on_member_join(self, member):
        """Automatically assign unverified role to new members"""
        guild_data = await self.bot.db.guilds.find_one({"guild_id": str(member.guild.id)})

        if not guild_data or "verification" not in guild_data or not guild_data["verification"].get("enabled"):
            return

        unverified_role_id = guild_data["verification"].get("unverified_role_id")
        if unverified_role_id:
            unverified_role = member.guild.get_role(int(unverified_role_id))
            if unverified_role:
                await member.add_roles(unverified_role)

async def setup(bot):
    await bot.add_cog(Verification(bot))

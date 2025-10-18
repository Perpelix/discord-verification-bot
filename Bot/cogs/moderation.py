import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime
import config

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    async def get_guild_data(self, guild_id):
        """Get or create guild data in database"""
        guild_data = await self.bot.db.guilds.find_one({"guild_id": str(guild_id)})
        if not guild_data:
            guild_data = {
                "guild_id": str(guild_id),
                "warns": {},
                "settings": {
                    "max_warns": config.MAX_WARNS_BEFORE_BAN
                }
            }
            await self.bot.db.guilds.insert_one(guild_data)
        return guild_data

    @app_commands.command(name="warn", description="Warn a user")
    @app_commands.describe(user="The user to warn", reason="Reason for the warning")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def warn(self, interaction: discord.Interaction, user: discord.Member, reason: str = "No reason provided"):
        if user.bot:
            await interaction.response.send_message("❌ You cannot warn bots!", ephemeral=True)
            return

        if user.id == interaction.user.id:
            await interaction.response.send_message("❌ You cannot warn yourself!", ephemeral=True)
            return

        if user.top_role >= interaction.user.top_role:
            await interaction.response.send_message("❌ You cannot warn users with equal or higher roles!", ephemeral=True)
            return

        guild_data = await self.get_guild_data(interaction.guild.id)
        user_id = str(user.id)

        # Initialize user warns if not exists
        if user_id not in guild_data.get("warns", {}):
            guild_data["warns"] = guild_data.get("warns", {})
            guild_data["warns"][user_id] = []

        # Add warn
        warn_data = {
            "reason": reason,
            "moderator_id": str(interaction.user.id),
            "timestamp": datetime.utcnow().isoformat()
        }
        guild_data["warns"][user_id].append(warn_data)

        # Update database
        await self.bot.db.guilds.update_one(
            {"guild_id": str(interaction.guild.id)},
            {"$set": {"warns": guild_data["warns"]}}
        )

        warn_count = len(guild_data["warns"][user_id])
        max_warns = guild_data.get("settings", {}).get("max_warns", config.MAX_WARNS_BEFORE_BAN)

        # Create embed
        embed = discord.Embed(
            title="⚠️ User Warned",
            color=config.EMBED_COLOR_WARNING,
            timestamp=datetime.utcnow()
        )
        embed.add_field(name="User", value=f"{user.mention} ({user.id})", inline=True)
        embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)
        embed.add_field(name="Warns", value=f"{warn_count}/{max_warns}", inline=True)
        embed.add_field(name="Reason", value=reason, inline=False)

        # Check if user should be banned
        if warn_count >= max_warns:
            try:
                await user.ban(reason=f"Exceeded maximum warnings ({max_warns})")
                embed.add_field(name="⛔ Action Taken", value="User has been banned for exceeding maximum warnings!", inline=False)
                embed.color = config.EMBED_COLOR_ERROR

                # Clear warns after ban
                guild_data["warns"][user_id] = []
                await self.bot.db.guilds.update_one(
                    {"guild_id": str(interaction.guild.id)},
                    {"$set": {"warns": guild_data["warns"]}}
                )
            except discord.Forbidden:
                embed.add_field(name="❌ Error", value="Failed to ban user. Check bot permissions.", inline=False)

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="warnings", description="Check warnings for a user")
    @app_commands.describe(user="The user to check warnings for")
    async def warnings(self, interaction: discord.Interaction, user: discord.Member = None):
        user = user or interaction.user
        guild_data = await self.get_guild_data(interaction.guild.id)

        user_id = str(user.id)
        warns = guild_data.get("warns", {}).get(user_id, [])

        embed = discord.Embed(
            title=f"⚠️ Warnings for {user.display_name}",
            color=config.EMBED_COLOR_INFO,
            timestamp=datetime.utcnow()
        )
        embed.set_thumbnail(url=user.display_avatar.url)

        if not warns:
            embed.description = "No warnings found!"
        else:
            max_warns = guild_data.get("settings", {}).get("max_warns", config.MAX_WARNS_BEFORE_BAN)
            embed.description = f"**Total Warnings:** {len(warns)}/{max_warns}\n\n"

            for i, warn in enumerate(warns, 1):
                moderator = interaction.guild.get_member(int(warn['moderator_id']))
                mod_name = moderator.mention if moderator else f"Unknown (ID: {warn['moderator_id']})"
                timestamp = warn.get('timestamp', 'Unknown')

                embed.add_field(
                    name=f"Warning #{i}",
                    value=f"**Reason:** {warn['reason']}\n**Moderator:** {mod_name}\n**Date:** {timestamp[:10]}",
                    inline=False
                )

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="clearwarns", description="Clear all warnings for a user")
    @app_commands.describe(user="The user to clear warnings for")
    @app_commands.checks.has_permissions(administrator=True)
    async def clearwarns(self, interaction: discord.Interaction, user: discord.Member):
        guild_data = await self.get_guild_data(interaction.guild.id)
        user_id = str(user.id)

        if user_id not in guild_data.get("warns", {}) or not guild_data["warns"][user_id]:
            await interaction.response.send_message(f"❌ {user.mention} has no warnings!", ephemeral=True)
            return

        warn_count = len(guild_data["warns"][user_id])
        guild_data["warns"][user_id] = []

        await self.bot.db.guilds.update_one(
            {"guild_id": str(interaction.guild.id)},
            {"$set": {"warns": guild_data["warns"]}}
        )

        embed = discord.Embed(
            title="✅ Warnings Cleared",
            description=f"Cleared **{warn_count}** warning(s) for {user.mention}",
            color=config.EMBED_COLOR_SUCCESS
        )

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="kick", description="Kick a user from the server")
    @app_commands.describe(user="The user to kick", reason="Reason for the kick")
    @app_commands.checks.has_permissions(kick_members=True)
    async def kick(self, interaction: discord.Interaction, user: discord.Member, reason: str = "No reason provided"):
        if user.bot:
            await interaction.response.send_message("❌ You cannot kick bots!", ephemeral=True)
            return

        if user.id == interaction.user.id:
            await interaction.response.send_message("❌ You cannot kick yourself!", ephemeral=True)
            return

        if user.top_role >= interaction.user.top_role:
            await interaction.response.send_message("❌ You cannot kick users with equal or higher roles!", ephemeral=True)
            return

        try:
            await user.kick(reason=f"{reason} | Kicked by {interaction.user}")
            embed = discord.Embed(
                title="👢 User Kicked",
                color=config.EMBED_COLOR_WARNING,
                timestamp=datetime.utcnow()
            )
            embed.add_field(name="User", value=f"{user.mention} ({user.id})", inline=True)
            embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)
            embed.add_field(name="Reason", value=reason, inline=False)

            await interaction.response.send_message(embed=embed)
        except discord.Forbidden:
            await interaction.response.send_message("❌ I don't have permission to kick this user!", ephemeral=True)

    @app_commands.command(name="ban", description="Ban a user from the server")
    @app_commands.describe(user="The user to ban", reason="Reason for the ban")
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(self, interaction: discord.Interaction, user: discord.Member, reason: str = "No reason provided"):
        if user.bot:
            await interaction.response.send_message("❌ You cannot ban bots!", ephemeral=True)
            return

        if user.id == interaction.user.id:
            await interaction.response.send_message("❌ You cannot ban yourself!", ephemeral=True)
            return

        if user.top_role >= interaction.user.top_role:
            await interaction.response.send_message("❌ You cannot ban users with equal or higher roles!", ephemeral=True)
            return

        try:
            await user.ban(reason=f"{reason} | Banned by {interaction.user}")
            embed = discord.Embed(
                title="🔨 User Banned",
                color=config.EMBED_COLOR_ERROR,
                timestamp=datetime.utcnow()
            )
            embed.add_field(name="User", value=f"{user.mention} ({user.id})", inline=True)
            embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)
            embed.add_field(name="Reason", value=reason, inline=False)

            await interaction.response.send_message(embed=embed)
        except discord.Forbidden:
            await interaction.response.send_message("❌ I don't have permission to ban this user!", ephemeral=True)

    @app_commands.command(name="unban", description="Unban a user from the server")
    @app_commands.describe(user_id="The ID of the user to unban")
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(self, interaction: discord.Interaction, user_id: str):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user)

            embed = discord.Embed(
                title="✅ User Unbanned",
                description=f"Successfully unbanned **{user.name}** ({user.id})",
                color=config.EMBED_COLOR_SUCCESS
            )

            await interaction.response.send_message(embed=embed)
        except discord.NotFound:
            await interaction.response.send_message("❌ User not found or not banned!", ephemeral=True)
        except discord.Forbidden:
            await interaction.response.send_message("❌ I don't have permission to unban users!", ephemeral=True)

async def setup(bot):
    await bot.add_cog(Moderation(bot))

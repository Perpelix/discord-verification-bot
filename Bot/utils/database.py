# Database utility functions for the bot

async def get_guild_config(db, guild_id):
    """Get guild configuration from database"""
    guild_data = await db.guilds.find_one({"guild_id": str(guild_id)})
    if not guild_data:
        # Create default config
        guild_data = {
            "guild_id": str(guild_id),
            "warns": {},
            "settings": {
                "max_warns": 3
            }
        }
        await db.guilds.insert_one(guild_data)
    return guild_data

async def save_guild_config(db, guild_id, config):
    """Save guild configuration to database"""
    await db.guilds.update_one(
        {"guild_id": str(guild_id)},
        {"$set": config},
        upsert=True
    )

async def get_user_warns(db, guild_id, user_id):
    """Get user warns for a specific guild"""
    guild_data = await get_guild_config(db, guild_id)
    return guild_data.get("warns", {}).get(str(user_id), [])

async def add_warn(db, guild_id, user_id, warn_data):
    """Add a warn to a user"""
    guild_data = await get_guild_config(db, guild_id)

    if "warns" not in guild_data:
        guild_data["warns"] = {}

    if str(user_id) not in guild_data["warns"]:
        guild_data["warns"][str(user_id)] = []

    guild_data["warns"][str(user_id)].append(warn_data)

    await save_guild_config(db, guild_id, guild_data)
    return len(guild_data["warns"][str(user_id)])

async def clear_warns(db, guild_id, user_id):
    """Clear all warns for a user"""
    guild_data = await get_guild_config(db, guild_id)

    if "warns" in guild_data and str(user_id) in guild_data["warns"]:
        warn_count = len(guild_data["warns"][str(user_id)])
        guild_data["warns"][str(user_id)] = []
        await save_guild_config(db, guild_id, guild_data)
        return warn_count

    return 0

async def get_verification_status(db, guild_id, user_id):
    """Check if user is verified in a guild"""
    verification = await db.verifications.find_one({
        "guild_id": str(guild_id),
        "user_id": str(user_id)
    })
    return verification is not None

async def save_verification(db, guild_id, user_id, data):
    """Save verification data"""
    await db.verifications.insert_one({
        "guild_id": str(guild_id),
        "user_id": str(user_id),
        **data
    })

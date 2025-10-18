# Features Overview

## Discord Bot Features

### 1. Verification System
- **Automatic Role Assignment**: New members get "Unverified" role automatically
- **Verification Panel**: Admin creates verification embed with green button
- **IP-Based Verification**: Collects and stores user IP for alt detection
- **Browser Fingerprinting**: Stores browser info, user agent, device type
- **Alt Account Detection**: Automatically detects and blocks alt accounts
- **Manual Override**: Admins can manually verify users with `/manverify`
- **Channel Restrictions**: Unverified users only see verification channel

### 2. Moderation System
- **Warning System**: Warn users with `/warn` command
- **Auto-Ban**: Automatic ban after 3 warnings (configurable)
- **Warn History**: View all warns for a user with `/warnings`
- **Clear Warns**: Remove all warns with `/clearwarns`
- **Kick/Ban**: Standard moderation commands
- **Unban**: Unban users by ID
- **Per-Server Data**: All moderation data stored separately per server

### 3. Bot Architecture
- **Cog-Based**: Organized, modular code structure
- **MongoDB Integration**: All data in MongoDB for scalability
- **Async/Await**: Modern async Python for performance
- **Error Handling**: Comprehensive error handling and user feedback
- **Permission Checks**: Role-based command restrictions

## Website Features

### 1. Verification Page (`/verify`)
- **Beautiful UI**: Modern, animated verification interface
- **Data Collection**: Captures IP, browser, user agent, device type
- **Alt Detection**: Real-time check against existing accounts
- **Instant Feedback**: Shows success or error immediately
- **Auto-Close**: Button to close window after verification

### 2. Admin Dashboard (`/dashboard`)
- **Login System**: Secure JWT-based authentication
- **Global Statistics**:
  - Total guilds
  - Total verifications
  - Alt accounts detected
  - Total users
- **Guild Management**:
  - View all guilds bot is in
  - See verification status per guild
  - View warn counts
  - See alt account detections
- **Real-Time Data**: Fetches latest data from MongoDB
- **Responsive Design**: Works on all devices

### 3. User Search (`/google`)
- **Username/Email Search**: Search by username or email
- **Alt Account Discovery**: Shows all linked alt accounts
- **Shared IP Display**: See which IPs are shared
- **Common Servers**: View which servers accounts have in common
- **Detailed Results**: Complete information for each account
- **Admin Only**: Requires authentication

### 4. Home Page (`/`)
- **Feature Showcase**: Displays all bot features
- **Modern Design**: Gradient background, animations
- **Quick Links**: Direct access to dashboard and search
- **Responsive**: Mobile-friendly design

## Technical Features

### 1. Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Environment Variables**: Sensitive data in env vars
- **API Secret Keys**: Bot-to-website communication secured
- **Permission Checks**: Role-based access control

### 2. Database Schema
- **Guilds Collection**: Server configs, warns, verification settings
- **Verifications Collection**: User verification data with IPs
- **Users Collection**: Global user data with IP history
- **Alt Accounts Collection**: Detected alt account links
- **Admins Collection**: Dashboard admin accounts

### 3. Performance
- **Connection Pooling**: MongoDB connection reuse
- **Async Operations**: Non-blocking database operations
- **Efficient Queries**: Indexed database queries
- **Serverless Optimized**: Under 11 API routes for Vercel
- **Client-Side Caching**: Reduced API calls

### 4. Developer Experience
- **TypeScript Ready**: Easy to migrate to TypeScript
- **Environment Templates**: .env.example files provided
- **Documentation**: Comprehensive README files
- **Setup Guide**: Step-by-step setup instructions
- **Helper Scripts**: Admin creation script included

## Alt Account Detection Algorithm

1. **On Verification**:
   - Capture user's IP address
   - Check database for existing verifications with same IP in same guild
   - If found: Mark as alt account and deny verification
   - If not found: Save verification data with IP

2. **Data Storage**:
   - Save IP to user's verification record
   - Add IP to user's global IP list (last 10 IPs)
   - Link guild to user's verification list

3. **Detection Logic**:
   - If IP exists for different user in same guild → Alt detected
   - Store alt relationship in `alt_accounts` collection
   - Include timestamp and detection details

4. **Search Features**:
   - Search shows all users with shared IPs
   - Displays all guilds where IPs overlap
   - Shows connection graph of alt accounts

## API Endpoints

### Public Endpoints
- `POST /api/verify` - User verification

### Authenticated Endpoints (Admin)
- `POST /api/auth/login` - Admin login
- `GET /api/stats` - Global statistics
- `GET /api/guilds/list` - List all guilds
- `GET /api/guilds/[guildId]` - Get guild data
- `PUT /api/guilds/[guildId]` - Update guild settings
- `POST /api/google` - Search users/alts

### Bot Endpoints (Secret Key)
- `POST /api/bot/webhook` - Bot webhook
  - Actions: verify_user, check_alt, get_user_data

## Moderation Features in Detail

### Warning System
1. `/warn @user reason`:
   - Records warn with reason, moderator, timestamp
   - Stores in guild's warns object
   - Returns current warn count
   - Auto-bans at 3 warns (configurable)
   - Clears warns after ban

2. `/warnings @user`:
   - Shows all warns for user
   - Displays moderator who warned
   - Shows warn dates
   - Shows current warn count vs max

3. `/clearwarns @user`:
   - Removes all warns for user
   - Requires administrator permission
   - Returns number of warns cleared

### Other Moderation
- `/kick @user reason` - Kick with reason logged
- `/ban @user reason` - Ban with reason logged
- `/unban user_id` - Unban by ID

## Verification Flow in Detail

1. **Setup Phase** (`/verifypanel`):
   - Bot creates "Verified" role (green)
   - Bot creates "Unverified" role (red)
   - Bot creates "VERIFICATION" category
   - Bot creates "verify" channel in category
   - Sets permissions: Unverified can only see verify channel
   - Sends verification embed with green button
   - Button links to website with guild ID

2. **User Joins Server**:
   - Bot automatically assigns "Unverified" role
   - User can only see #verify channel
   - User sees verification embed

3. **User Clicks Verify**:
   - Redirected to website: `/verify?guild=XXX`
   - Website captures:
     - IP address from request headers
     - User agent
     - Browser name and version
     - Operating system
     - Device type
   - Website checks database for IP match in guild
   - If alt: Show error, deny verification
   - If clean: Save data, mark as verified

4. **After Verification**:
   - Website notifies bot (via database)
   - Bot removes "Unverified" role
   - Bot adds "Verified" role
   - User gains access to all channels
   - Bot sends DM to user confirming verification

5. **Manual Verification** (`/manverify @user`):
   - Admin can bypass IP check
   - Immediately gives verified role
   - Logs as manual verification
   - Useful for false positives or special cases

## Customization Options

### Bot Configuration
- Change max warns before ban in `config.py`
- Customize role names
- Change embed colors
- Modify verification channel name

### Website Styling
- All styles inline for easy customization
- Change colors in each page
- Modify gradients and animations
- Customize embed designs

### Database Schema
- Extend guild settings
- Add custom fields to verifications
- Store additional user data
- Implement custom collections

## Limitations & Considerations

1. **IP Detection**:
   - VPN users may appear as alts
   - Shared networks (school, work) may trigger false positives
   - Manual verification available for these cases

2. **Vercel Limits**:
   - 10 second serverless function timeout
   - API route file limit (using 7/11)
   - 4.5MB function size limit

3. **Discord Limits**:
   - Rate limits on role assignments
   - Max 250 roles per server
   - Permission hierarchy requirements

4. **MongoDB**:
   - Free tier has storage limits
   - Connection limits on free tier
   - Requires indexing for performance at scale

## Future Enhancement Ideas

- Discord OAuth integration
- Email verification option
- Captcha integration
- Phone number verification
- IP whitelist for admins
- Custom verification questions
- Automated appeal system
- Detailed analytics dashboard
- Export data to CSV
- Webhook notifications
- Multi-language support

# 🛡️ Discord Moderation Bot
Developed by: ZeonXq (zeon.sls)

A powerful and stylish Discord moderation bot built with **Node.js** and **discord.js v14**, designed for modern server management.

---

## 🚀 Features
- Slash command support
- Text and voice mute system (temp & permanent)
- Warning system with JSON storage
- Logging system with toggle support
- Channel locking, slowmode, purge
- Easy setup & clean structure

---

## 📁 Folder Structure
/commands/ → All command files (grouped by category)
/moderation/ → Ban, mute, warn, etc.
/general/ → /help
/config/ → Config file with token, role IDs
/data/ → Warn logs (JSON)
/utils/ → Helper functions (logger, warn manager)
events/ → ready, interactionCreate
index.js → Main bot file
setup.bat → Installs dependencies
start.bat → Launches bot with style

---

## ⚙️ Installation

```bash
git clone https://github.com/ZeonXq/zeonxq-bot.git
cd zeonxq-bot

Edit config/config.json and insert your bot token, IDs, etc.

npm install (or just double-click setup.bat)

run start.bat to run the bot



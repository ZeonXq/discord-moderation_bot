const fs = require('fs');
const path = require('path');
const warnFile = path.join(__dirname, '../data/warns.json');

function loadWarns() {
  if (!fs.existsSync(warnFile)) return {};
  return JSON.parse(fs.readFileSync(warnFile, 'utf8'));
}

function saveWarns(data) {
  fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
}

function addWarn(userId, guildId, warnData) {
  const warns = loadWarns();
  if (!warns[guildId]) warns[guildId] = {};
  if (!warns[guildId][userId]) warns[guildId][userId] = [];
  warns[guildId][userId].push(warnData);
  saveWarns(warns);
}

function getWarns(userId, guildId) {
  const warns = loadWarns();
  return warns[guildId]?.[userId] || [];
}

function removeWarn(userId, guildId, index) {
  const warns = loadWarns();
  if (!warns[guildId] || !warns[guildId][userId]) return false;
  warns[guildId][userId].splice(index, 1);
  saveWarns(warns);
  return true;
}

module.exports = { addWarn, getWarns, removeWarn };

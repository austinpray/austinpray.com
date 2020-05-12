function normalizeStr(s) {
  return s.split('\n').map(s => s.trim()).filter(s => s).join('\n')
}

module.exports = {
  normalizeStr
};

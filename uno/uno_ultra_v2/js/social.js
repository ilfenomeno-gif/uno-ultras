const FRIENDS_KEY = "uno-ultra-v2-friends";
const CLUB_KEY = "uno-ultra-v2-club";

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function createSocialService() {
  let friends = loadJson(FRIENDS_KEY, []);
  let club = loadJson(CLUB_KEY, { name: null, tag: null, level: 1, xp: 0 });

  return {
    listFriends() {
      return [...friends];
    },
    addFriend(name) {
      const clean = String(name || "").trim();
      if (!clean) return false;
      if (friends.includes(clean)) return false;
      friends.push(clean);
      saveJson(FRIENDS_KEY, friends);
      return true;
    },
    removeFriend(name) {
      friends = friends.filter((f) => f !== name);
      saveJson(FRIENDS_KEY, friends);
    },
    getClub() {
      return { ...club };
    },
    setClub(name, tag) {
      club = { ...club, name: name || null, tag: tag || null };
      saveJson(CLUB_KEY, club);
    },
    addClubXp(amount) {
      club.xp += Math.max(0, Number(amount) || 0);
      while (club.xp >= 1000) {
        club.xp -= 1000;
        club.level += 1;
      }
      saveJson(CLUB_KEY, club);
      return { ...club };
    },
  };
}

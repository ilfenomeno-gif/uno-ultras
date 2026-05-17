import { loadSession, clearSession } from '@auth/session.js';
import { cloudLoadPlayer          } from '@auth/cloudAuth.js';
import { loadLocalProfile, saveLocalProfile, createProfile } from '@auth/profile.js';
import { applyColorblind          } from '@accessibility/colorblind.js';
import { checkDailyLogin          } from '@progression/challenges.js';
import { loadTheme                } from '@settings/themes.js';
import { site                     } from '@ui/Site.js';

export async function init(): Promise<void> {
  loadTheme();
  const session = await loadSession();
  if (session?.username) {
    const profile = await cloudLoadPlayer(session.username);
    if (profile) {
      saveLocalProfile(profile);
      applyColorblind(profile.locker?.colorblind ?? false);
      checkDailyLogin(profile);
      site().router.show('splash');
      return;
    }
    await clearSession();
  }
  // Fallback: prova profilo locale (offline)
  const local = loadLocalProfile();
  if (local) {
    applyColorblind(local.locker?.colorblind ?? false);
    site().router.show('splash');
    return;
  }
  site().router.show('login');
}

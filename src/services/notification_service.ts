/**
 * Notification Service for PregNutri AI
 * Handles browser Web Notifications, permission checks, and cross-tab deduplication.
 * 
 * Honest Notification Disclosure:
 * - App Open (Foreground): In-app visual notification banner + soothing audio chime + browser notification.
 * - App in Background (Tab minimized / running in background): Native browser notifications fire via Web Notification API.
 * - App Fully Closed: Background notifications will NOT fire because no persistent Web Push / Service Worker
 *   push server is configured on the backend.
 */

class NotificationService {
  private inMemoryAlerts: Record<string, number> = {};

  /**
   * Checks whether the current browser environment supports the Web Notification API.
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Returns current notification permission state ('default' | 'granted' | 'denied').
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    try {
      return Notification.permission;
    } catch {
      return 'denied';
    }
  }

  /**
   * Requests permission from the user for desktop/browser notifications.
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }
    try {
      const res = await Notification.requestPermission();
      return res;
    } catch (e) {
      console.warn('[NotificationService] Permission request error:', e);
      return 'denied';
    }
  }

  /**
   * Dispatches a notification if permitted and deduplicates across tabs using localStorage.
   * @param dedupeKey Unique identifier for this alert (e.g. 'water_2026-10-23_14', 'meal_lunch_2026-10-23')
   * @param title Notification title
   * @param options Notification options (body, icon, cooldownSeconds)
   */
  public sendNotification(
    dedupeKey: string,
    title: string,
    options: {
      body: string;
      icon?: string;
      cooldownSeconds?: number;
    }
  ): boolean {
    const cooldownMs = (options.cooldownSeconds || 180) * 1000;
    const now = Date.now();

    // 1. Cross-tab deduplication check via localStorage
    try {
      const storageKey = `pregnutri_alert_ts_${dedupeKey}`;
      const lastFired = localStorage.getItem(storageKey);
      if (lastFired) {
        const lastTs = Number(lastFired);
        if (now - lastTs < cooldownMs) {
          // Already sent recently in this or another open tab
          return false;
        }
      }
      localStorage.setItem(storageKey, String(now));
    } catch (e) {
      // LocalStorage access failback
    }

    // 2. In-memory deduplication check
    if (this.inMemoryAlerts[dedupeKey] && now - this.inMemoryAlerts[dedupeKey] < cooldownMs) {
      return false;
    }
    this.inMemoryAlerts[dedupeKey] = now;

    // 3. Native Browser Notification (if granted)
    if (this.isSupported() && this.getPermission() === 'granted') {
      try {
        new Notification(title, {
          body: options.body,
          icon: options.icon || '/assets/aistudio/image_e5d39059.png',
          tag: dedupeKey
        });
        return true;
      } catch (err) {
        console.warn('[NotificationService] Native notification dispatch error:', err);
      }
    }

    return false;
  }
}

export const notificationService = new NotificationService();

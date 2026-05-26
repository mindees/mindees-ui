import { useCallback } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface UseAnnouncerOptions {
  /**
   * `polite` (default) — announces after the user finishes their current
   * interaction. `assertive` — interrupts the screen reader queue. Reserve
   * assertive for genuine errors / time-critical updates.
   */
  readonly priority?: 'polite' | 'assertive';
}

/**
 * Returns a stable `announce(message)` callback that pushes a string to
 * the platform screen reader (VoiceOver on iOS, TalkBack on Android, the
 * web's live region on RN Web).
 *
 * @example
 * const announce = useAnnouncer();
 * announce('Saved');
 * announce('Could not save', { priority: 'assertive' });
 */
export function useAnnouncer(): (message: string, options?: UseAnnouncerOptions) => void {
  return useCallback((message: string, options?: UseAnnouncerOptions) => {
    if (!message) return;
    // RN's accessibility queue is `polite` by design. The `priority` flag is
    // exposed in newer SDKs via the second-arg options object; we pass it
    // through if present and fall back to the single-arg call otherwise.
    const announce = AccessibilityInfo.announceForAccessibility;
    const announceWithOptions = (
      AccessibilityInfo as unknown as {
        announceForAccessibilityWithOptions?: (
          m: string,
          o: { queue?: boolean; nativeID?: string },
        ) => void;
      }
    ).announceForAccessibilityWithOptions;
    if (options?.priority === 'assertive' && typeof announceWithOptions === 'function') {
      announceWithOptions(message, { queue: false });
      return;
    }
    announce(message);
  }, []);
}

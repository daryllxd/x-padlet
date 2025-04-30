/**
 * Converts an emoji code (e.g., '1f603') to its Unicode representation (e.g., '😃')
 */
export function codeToEmoji(code: string): string {
  // Split the code into parts (some emojis have multiple code points)
  const codePoints = code.split('-').map((hex) => parseInt(hex, 16));
  return String.fromCodePoint(...codePoints);
}

/**
 * Converts an emoji character (e.g., '😃') to its code representation (e.g., '1f603')
 */
export function emojiToCode(emoji: string): string {
  return Array.from(emoji)
    .map((char) => char.codePointAt(0)?.toString(16).padStart(4, '0'))
    .join('-');
}

/**
 * Returns both the animated and non-animated versions of an emoji
 */
export function getEmojiVariants(code: string): {
  animated: string;
  static: string;
} {
  return {
    animated: `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/lottie.json`,
    static: `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`,
  };
}

/**
 * Mapping of emoji names to their codes
 */
export const EMOJI_MAP = {
  smile: '1f604',
  'smile-with-big-eyes': '1f603',
  grin: '1f601',
  rofl: '1f923',
  'loudly-crying': '1f62d',
  wink: '1f609',
  'heart-face': '1f970',
  'heart-eyes': '1f60d',
  'star-struck': '1f929',
  'happy-cry': '1f602',
  'holding-back-tears': '1f972',
  blush: '1f60a',
  grinning: '1f600',
  kissing: '1f617',
  'partying-face': '1f973',
  'warm-smile': '1f642',
  laughing: '1f606',
  'kissing-smiling-eyes': '1f619',
  melting: '1fae0',
  relieved: '1f60c',
  'grin-sweat': '1f605',
  'kissing-closed-eyes': '1f61a',
  'upside-down-face': '1f643',
  'head-nod': '1fae1',
  joy: '1f602',
  'kissing-heart': '1f618',
  'slightly-happy': '1f642',
  'head-shake': '1fae2',
} as const;

export type EmojiName = keyof typeof EMOJI_MAP;

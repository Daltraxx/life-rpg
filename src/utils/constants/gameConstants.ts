/*
 * Game-related constants
 */

/**
 * A regular expression that matches safe characters for user input.
 *
 * This regex allows the following characters:
 * - Uppercase and lowercase letters (a-z, A-Z)
 * - Digits (0-9)
 * - Space and special characters: _ : ! ' " ( ) $ @ % & * - = + . / - —
 *
 * It is used to validate strings to ensure they only contain safe characters,
 * preventing issues with invalid input in the application.
 */
export const SAFE_CHARACTERS_REGEX = /^[a-zA-Z0-9 _:!'"\(\)$@%&*\-=+.\/ —]+$/;

// ------------------------------------------------------------------------

/**  Typical maximum length for user-facing names (e.g., usernames, attribute names).
 */
export const REGULAR_NAME_MAX_LENGTH = 30;
/**  Typical minimum length for user-facing names (e.g., usernames, attribute names).
 */
export const REGULAR_NAME_MIN_LENGTH = 1;

// ------------------------------------------------------------------------

/** Minimum number of quests a player must have.
 */
export const MIN_QUESTS_ALLOWED = 1;
/** Maximum number of quests a player can have active simultaneously.
 */
export const MAX_QUESTS_ALLOWED = 50;
/** Maximum experience points that can be awarded per quest.
 */
export const MAX_EXPERIENCE_POINTS_PER_QUEST = 100;

// ------------------------------------------------------------------------

/** Minimum number of attributes a player must have.
 */
export const MIN_ATTRIBUTES_ALLOWED = 1;
/** Maximum number of attributes a player can have.
 */
export const MAX_ATTRIBUTES_ALLOWED = 50;

// ------------------------------------------------------------------------

/** Minimum number of affected attributes required per quest.
 */
export const MIN_AFFECTED_ATTRIBUTES_PER_QUEST = 1;
/** Maximum number of affected attributes allowed per quest.
 */
export const MAX_AFFECTED_ATTRIBUTES_PER_QUEST = 50;

/*
 * Game-related constants
 */

/**
 * Maximum number of quests a player can have active simultaneously.
 */
export const MAX_QUESTS_ALLOWED = 50;

/**
 * Maximum number of attributes a player can have.
 */
export const MAX_ATTRIBUTES_ALLOWED = 50;

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

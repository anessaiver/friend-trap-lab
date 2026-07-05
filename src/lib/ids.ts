import { customAlphabet } from "nanoid";

// URL-safe, unambiguous (no 0/O/1/l/i).
const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";

export const newTrapId = customAlphabet(alphabet, 10);
export const newAttemptId = customAlphabet(alphabet, 12);

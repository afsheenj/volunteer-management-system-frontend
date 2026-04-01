import { jwtDecode } from "jwt-decode";

export function parseToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
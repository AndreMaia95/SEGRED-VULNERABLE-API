export function decodeToken(token) {
  try {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replaceAll("-", "+").replaceAll("_", "/")));
  } catch {
    return null;
  }
}

export function saveSession(token) {
  localStorage.setItem("oopsapi:token", token);
  localStorage.removeItem("oopsapi:user");
}

export function getSession() {
  const token = localStorage.getItem("oopsapi:token") || "";
  return { token, user: decodeToken(token) };
}

export function clearSession() {
  localStorage.removeItem("oopsapi:token");
  localStorage.removeItem("oopsapi:user");
}

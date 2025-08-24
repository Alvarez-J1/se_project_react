import { processResponse, baseUrl } from "./api";

function signUp({ email, password, name, avatar }) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, avatar }),
  }).then(processResponse);
}

function logIn({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(processResponse);
}

function checkToken(token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
}

function editProfile({ name, avatar }, token) {
  const payload = {};
  if (typeof name === "string") payload.name = name.trim();

  if (typeof avatar === "string") {
    payload.avatar = avatar.trim(); // could be '' if cleared
  }

  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(processResponse);
}

export { signUp, logIn, checkToken, editProfile };

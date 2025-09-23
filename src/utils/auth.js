import { processResponse } from "./api";

import { BASE_URL } from "./constants";

function signUp({ email, password, name, avatar }) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, avatar }),
  }).then(processResponse);
}

function logIn({ email, password }) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(processResponse);
}

function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
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

  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(processResponse);
}

export { signUp, logIn, checkToken, editProfile };

import { BASE_URL } from "./constants";

function getItems() {
  return fetch(`${BASE_URL}/items`).then(processResponse);
}

function addItem({ name, imageUrl, weather, token }) {
  return fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, imageUrl, weather }),
  }).then(processResponse);
}

function deleteItem(cardId, token) {
  return fetch(`${BASE_URL}/items/${cardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
}

function addCardLike(id, token) {
  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
}

function removeCardLike(id, token) {
  return fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(processResponse);
}

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

export {
  getItems,
  addItem,
  deleteItem,
  addCardLike,
  removeCardLike,
  processResponse,
};

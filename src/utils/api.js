const baseUrl = "http://localhost:3001";

function getItems() {
  return fetch(`${baseUrl}/items`).then(processResponse);
}

function addItems({ name, imageUrl, weather }) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, imageUrl, weather }),
  }).then(processResponse);
}

function deleteItems(cardId) {
  return fetch(`${baseUrl}/items/${cardId}`, {
    method: "DELETE",
  }).then(processResponse);
}

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

export { getItems, addItems, deleteItems, processResponse };

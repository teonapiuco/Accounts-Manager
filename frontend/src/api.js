const BASE_URL = "http://localhost:4000";

export async function getAccounts() {
  return fetch(`${BASE_URL}/accounts`).then((r) => r.json());
}

export async function createAccount(data) {
  return fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
}

export async function updateAccount(id, data) {
  return fetch(`${BASE_URL}/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());
}

export async function deleteAccount(id) {
  return fetch(`${BASE_URL}/accounts/${id}`, { method: "DELETE" });
}

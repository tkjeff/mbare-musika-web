const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

export function getSavedSession() {
  try { return JSON.parse(localStorage.getItem("mm_session") || "null"); }
  catch { return null; }
}

export function saveSession(session) {
  localStorage.setItem("mm_session", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("mm_session");
}

export async function apiRequest(path, options = {}, token = null) {
  const headers = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; }
  catch { payload = { message: text || "Unexpected response from server." }; }
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || payload.error || `Request failed (${response.status}).`);
  }
  return payload;
}

export async function uploadManagementImage(file, token) {
  if (!(file instanceof File)) {
    throw new Error("Select an image file before uploading.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/management/products/upload-image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await response.text();
  let payload = {};

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: text || "Unexpected response from image service." };
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Image upload failed (${response.status}).`);
  }

  if (!payload.imageUrl || typeof payload.imageUrl !== "string") {
    throw new Error("The image service did not return a valid image URL.");
  }

  return payload;
}

export { API_BASE_URL };

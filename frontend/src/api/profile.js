import api from "./axios";

export async function uploadMyLogo(file, token) {
  const form = new FormData();
  form.append("logo", file);

  const res = await api.post("/profile/me/logo", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

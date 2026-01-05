import api from "./axios";

export async function uploadStandCover(standId, file, token) {
  const form = new FormData();
  form.append("cover", file);

  const res = await api.post(`/stands/${standId}/cover`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

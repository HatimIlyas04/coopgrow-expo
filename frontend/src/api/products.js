import api from "./axios";

export async function uploadProductImage(productId, file, token) {
  const form = new FormData();
  form.append("image", file);

  const res = await api.post(`/products/${productId}/image`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

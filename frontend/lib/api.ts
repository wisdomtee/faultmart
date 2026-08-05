const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getHomeData() {
  const res = await fetch(`${API_URL}/api/home`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();

    console.log("HOME API ERROR:", errorText);

    throw new Error(
      `Homepage API failed: ${res.status}`
    );
  }

  const data = await res.json();

  return data.data;
}
export async function getCategoryListings(
  slug: string
) {
  const res = await fetch(
    `${API_URL}/api/categories/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data.data;
}
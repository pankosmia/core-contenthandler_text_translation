export async function toTemp(html) {
  const blob = new Blob([html], { type: "text/html" });

  // 2. Create FormData
  const formData = new FormData();

  // IMPORTANT: field name must match backend (likely "file")
  formData.append("file", blob, "test.html");
  try {
    const response = await fetch("/temp/bytes", {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    const { uuid } = JSON.parse(result);
    return uuid;
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

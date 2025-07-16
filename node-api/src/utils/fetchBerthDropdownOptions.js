// utils/fetchBerthDropdownOptions.js

export async function fetchBerthDropdownOptions({
  apiUrl,
  uiKey,
  filters = {},
  search = "",
  offSet = 0,
}) {
  try {
    const response = await fetch(`${apiUrl}/berthRoutes/search/berth/dropdown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uiKey,
        filters,
        searchString: search,
        offSet,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result?.data?.filter(Boolean) || [];
  } catch (error) {
    console.error("❌ fetchBerthDropdownOptions Error:", error.message);
    return [];
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
export async function submitForm(endpoint: string, payload: FormData | Record<string, unknown>) {
  const isForm = payload instanceof FormData;
  const response = await fetch(`${API_URL}/${endpoint}`, { method: "POST", headers: isForm ? undefined : { "Content-Type": "application/json", Accept: "application/json" }, body: isForm ? payload : JSON.stringify(payload) });
  if (!response.ok) throw new Error("We could not submit your request. Please try again.");
  return response.json();
}

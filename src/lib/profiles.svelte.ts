export interface Profile {
  uuid: string;
  name: string;
  error?: string;
}

export const users: { current: string[] } = $state({ current: [] });
export const data: { json: string } = $state({ json: "[]" });

export async function fetchUUID(users: string[]): Promise<Profile[]> {
  const promises = users
    .map((item) => item.trim())
    .filter((item) => item.length >= 3 && item.length <= 16)
    .map((item) => {
      return fetch("/api?username=" + encodeURIComponent(item)).then((response) => response.json());
    });

  const result = (await Promise.allSettled(promises)).map((item, i) => {
    const data = item.status === "fulfilled" && item.value;
    if (data.message) {
      return {
        name: users[i],
        error: data.message,
      };
    } else {
      return data;
    }
  });

  return result as Profile[];
}

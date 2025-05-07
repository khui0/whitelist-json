export interface Profile {
  uuid: string;
  name: string;
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

  const result = (await Promise.allSettled(promises))
    .map((item) => {
      const o = item as { value: unknown };
      return o.value;
    })
    .filter((item) => !(item as { message: string }).message);

  return result as Profile[];
}

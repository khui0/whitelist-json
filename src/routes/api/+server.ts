// import { error } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const username = url.searchParams.get("username");

  const json = await fetchPlayerJSON(username || "");
  return new Response(JSON.stringify(json));
};

interface whitelistEntry {
  uuid: string;
  name: string;
}

async function fetchPlayerJSON(username: string): Promise<whitelistEntry> {
  const response = await fetch("https://api.mojang.com/users/profiles/minecraft/" + username);
  const result: {
    id: string;
    name: string;
  } = await response.json();
  if (response.ok) {
    try {
      return {
        uuid: toHyphenated(result.id),
        name: result.name,
      };
    } catch (e) {
      const err = e as Error;
      error(400, err.message);
    }
  }
  error(400, "unable to fetch this user");
}

function toHyphenated(uuid: string): string {
  const matches = uuid.match(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/);
  if (matches?.length !== 6) {
    throw new Error("unable to parse uuid");
  } else {
    return matches.slice(1).join("-");
  }
}

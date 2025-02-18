import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
} from "./secrets";

export async function authenticate({
  email,
  password,
  refresh_token,
}: {
  email?: string;
  password?: string;
  refresh_token?: string;
}) {
  let data;

  if (email && password) {
    data = {
      grant_type: "password",
      username: email,
      password: password,
      audience: AUTH0_AUDIENCE,
      scope: "openid profile email offline_access",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
    };
  } else if (refresh_token) {
    data = {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: AUTH0_CLIENT_ID,
    };
  } else {
    throw new Error("Either email/password or refresh_token is required");
  }

  console.log("Auth URL:", `https://${AUTH0_DOMAIN}/oauth/token`);
  console.log("Auth Data:", JSON.stringify(data));
  try {
    const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Auth0 error: ${JSON.stringify(errorData)}`);
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error during Auth0 token request:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Failed to authenticate with Auth0");
  }
}

type Cookie = {
  name: string
  value: string,
  path?: string,
  httponly?: boolean,
  secure?: boolean,
  samesite?: "Lax" | "Strict" | "None",
  expires?: number
}

const formatDate = (unix: number): string => {
  const date = new Date(unix * 1000);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'GMT',
    hour12: false
  });

  return formatter.format(date).replace(' at ', ' ') + ' GMT';
};

/**
 * Constructs the Access Token Cookie String
 * @param data The cookie data
 * @returns String format of the cookie data
 */
export function set_cookie(data: Cookie): string {
  let cookie_str = "";
  cookie_str += `${data.name}=${data.value}; `;

  if (data.path !== undefined) {
    cookie_str += `Path=${data.path}; `;
  }

  if (data.expires !== undefined) {
    cookie_str += `Expires=${formatDate(data.expires)}; `;
  }
  
  if (data.samesite !== undefined) {
    cookie_str += `SameSite=${data.samesite}; `;
  }

  if (data.httponly) {
    cookie_str += `HttpOnly; `;
  }

  if (data.secure) {
    cookie_str += `Secure; `;
  }

  return cookie_str;
}

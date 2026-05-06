// import { ApolloLink, HttpLink } from "@apollo/client";
// import { InMemoryCache } from "@apollo/client";
// import { ApolloClient } from "@apollo/client";
// import { gql, Observable } from "@apollo/client";
// import { onError } from "@apollo/client/link/error";

// type PendingRequest = {
//   resolve: () => void;
//   reject: (reason?: unknown) => void;
// };

// interface RefreshTokenResponse {
//   data?: {
//     refreshJWT?: {
//       success: boolean;
//       message: string;
//     };
//   };
//   errors?: Array<{ message: string; [key: string]: unknown }>;
// }

// // Refresh Token mutation
// const REFRRESH_TOKEN_MUTATION = gql`
//   mutation refreshTWT {
//     refreshJWT {
//       success
//       message
//     }
//   }
// `;

// let isRefreshing = false;
// let pendingRequests: PendingRequest[] = [];

// const resolvePendingRequest = (): void => {
//   pendingRequests.forEach(({ resolve }) => resolve());
// };

// const rejectPendingRequest = (err: unknown): void => {
//   pendingRequests.forEach(({ reject }) => reject(err));
// };

// // Triggered to generate refresh token
// async function triggerRefreshToken(): Promise<void> {
//   const response = await fetch(import.meta.env.VITE_API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ query: REFRRESH_TOKEN_MUTATION.loc?.source.body }),
//   });

//   const { data, errors } = (await response.json()) as RefreshTokenResponse;
//   if (errors?.length || !data?.refreshJWT?.success) {
//     throw new Error(
//       data?.refreshJWT?.message || "Refresh failed — session expired",
//     );
//   }
// }

// // It run when the GraphQL request throw an error
// const errorLink = onError(({ error, operation, forward }) => {
//   if (!error || !("errors" in error) || !Array.isArray(error.errors)) {
//     return;
//   }
//   const isUnauthorized = error.errors.some((err: any) => {
//     return (
//       err.message.toLowerCase().includes("not authorized") ||
//       err.message.toLowerCase().includes("unauthorized")
//     );
//   });

//   if (!isUnauthorized) {
//     return;
//   }

//   // If another request is refreshing then psuh it into the queue wait untill previous request is processing
//   if (isRefreshing) {
//     return new Observable((observer) => {
//       pendingRequests.push({
//         resolve: () => {
//           forward(operation).subscribe(observer);
//         },
//         reject: (err) => {
//           observer.error(err);
//         },
//       });
//     });
//   }

//   // First request → start refresh
//   isRefreshing = true;

//   return new Observable((observer) => {
//     triggerRefreshToken()
//       .then(() => {
//         resolvePendingRequest();
//         isRefreshing = false;

//         forward(operation).subscribe(observer); //retry to genrerate token
//       })
//       .catch((err) => {
//         rejectPendingRequest(err);
//         isRefreshing = false;

//         localStorage.removeItem("user");

//         window.dispatchEvent(new CustomEvent("session-expired"));
//         observer.error(err);
//       });
//   });
// });

// const httpLink = new HttpLink({
//   uri: import.meta.env.VITE_API_URL,
//   credentials: "include",
// });

// export const client = new ApolloClient({
//   link: ApolloLink.from([errorLink, httpLink]),
//   cache: new InMemoryCache(),
// });


// lib/apolloclient.ts
import { ApolloLink, HttpLink, ApolloClient, InMemoryCache, gql, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

type PendingRequest = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const resolvePendingRequest = () => {
  pendingRequests.forEach(({ resolve }) => resolve());
  pendingRequests = [];
};

const rejectPendingRequest = (err: unknown) => {
  pendingRequests.forEach(({ reject }) => reject(err));
  pendingRequests = [];
};

const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshJWT {
    refreshJWT {
      success
      message
    }
  }
`;

async function triggerRefreshToken() {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query: REFRESH_TOKEN_MUTATION.loc?.source.body }),
  });

  const { data } = await response.json();

  if (!data?.refreshJWT?.success) {
    throw new Error("Refresh failed");
  }
}

const errorLink = onError(({ error, operation, forward }) => {
  // if (!error || !("errors" in error)) return;
 if (!error || !("errors" in error) || !Array.isArray(error.errors)) {
    return;
  }
  const isUnauthorized = error.errors?.some(
    (err: any) => err.extensions?.code === "UNAUTHENTICATED"
  );

  if (!isUnauthorized) return;

  if (isRefreshing) {
    return new Observable((observer) => {
      pendingRequests.push({
        resolve: () => forward(operation).subscribe(observer),
        reject: (err) => observer.error(err),
      });
    });
  }

  isRefreshing = true;

  return new Observable((observer) => {
    triggerRefreshToken()
      .then(() => {
        resolvePendingRequest();
        isRefreshing = false;
        forward(operation).subscribe(observer);
      })
      .catch((err) => {
        rejectPendingRequest(err);
        isRefreshing = false;

        // ❗ Only clear auth — DO NOT navigate here
        localStorage.removeItem("user");

        observer.error(err);
      });
  });
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: "include",
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
/**
 * Helper to get an environment variable or throw a clear error
 * @param name The name of the environment variable
 * @returns The value of the environment variable
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`FATAL: Environment variable "${name}" not found`);
  }
  return value;
}

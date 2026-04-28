export function hasConfiguredDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return false;
  }

  if (databaseUrl.includes("<") || databaseUrl.includes(">")) {
    return false;
  }

  return databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
}

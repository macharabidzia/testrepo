// lib/utils.ts

export const createQueryString = (
  params: Record<string, string | number | undefined | null>
): string => {
  const newParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      newParams.set(key, String(value));
    }
  }
  return newParams.toString();
};

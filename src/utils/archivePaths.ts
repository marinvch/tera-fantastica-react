const PUBLIC_PATH_PREFIX = "/";

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value);

export const normalizePublicAssetPath = (value: string): string => {
  if (!value) {
    return "";
  }

  if (isAbsoluteUrl(value) || value.startsWith(PUBLIC_PATH_PREFIX)) {
    return value;
  }

  return `${PUBLIC_PATH_PREFIX}${value.replace(/^\.?\//, "")}`;
};

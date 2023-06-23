export const replaceHttp = (link) => {
  if (!link) return;
  return link.replace("http://", "https://");
};

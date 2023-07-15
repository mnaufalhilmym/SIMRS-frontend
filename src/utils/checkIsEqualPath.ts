export default function checkIsEqualPath(sitePath: string, pathname: string) {
  const formattedSitePath = reformatPath(sitePath);

  const dynIdx = [];
  for (const [idx, path] of formattedSitePath.split("/").entries()) {
    if (path === ":_") {
      dynIdx.push(idx);
    }
  }

  const splittedPathname = pathname.split("/");
  for (const idx of dynIdx) {
    splittedPathname[idx] = ":_";
  }
  const formattedPathname = splittedPathname.join("/");

  return formattedSitePath === formattedPathname;
}

function reformatPath(path: string) {
  const p = (path + "/").replace(/(?<=\/\:)(.*?)(?=\/)/, "_");
  return p.substring(0, p.length - 1);
}

//Copied from here: https://stackoverflow.com/a/3410557/8701527
export const findAllOccurrences = (
  searchStr: string,
  str: string,
  caseSensitive = true
) => {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

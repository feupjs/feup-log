export const filterParams = (obj: object) => {
  const params = { ...obj };
  const paramsKeys = Object.keys(params);
  for (let i = 0; i < paramsKeys.length; i++) {
    if (!params[paramsKeys[i]]) {
      delete params[paramsKeys[i]];
    }
  }
  return params;
};

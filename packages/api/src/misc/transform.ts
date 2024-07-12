export const fieldListPropsIntoObject = (fieldList: string) => {
  return fieldList.split(',').reduce((acc, cur) => {
    const [field, prop] = cur.split('.');
    acc[field] = prop;
    return acc;
  }, {});
};

import { fieldListPropsIntoObject } from './transform';

test('@fieldListPropsIntoObject', () => {
  const fieldList = 'field1.prop1,field2.prop2';
  const expected = {
    field1: 'prop1',
    field2: 'prop2',
  };
  expect(fieldListPropsIntoObject(fieldList)).toEqual(expected);
});

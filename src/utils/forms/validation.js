export const schemaConstructorValidation = (vals) => {
  const values = vals.toJS();

  return {
    name: !values.name ? 'Required' : '',
    namespace: !values.namespace ? 'Required' : '',
  };
};

export const addFieldValidation = (vals) => {
  const values = vals.toJS();

  return {
    fieldName: !values.fieldName ? 'Required' : '',
    fieldType: !values.fieldType ? 'Required' : '',
  };
};

import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };
  return { values, handleChange, setValues };
}

import { ChangeEvent, Dispatch, FormEventHandler, SetStateAction } from "react";

interface InputProps {
  setInputValue: Dispatch<SetStateAction<string>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  value?: string;
}

export function Input({ setInputValue, onSubmit, value }: InputProps) {
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Enter tweet link!"
        value={value}
        onChange={onInputChange}
        style={{ backgroundColor: "white", color: "black", minWidth: "800px" }}
      />
      <button type="submit" className="cta-button submit-gif-button">
        Submit
      </button>
    </form>
  );
}

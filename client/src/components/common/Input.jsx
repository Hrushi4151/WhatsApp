import React from "react";

function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label htmlFor="name" className="text-teal-light text-lg px-1">
          {name}
        </label>
      )}
      <div>
        <input className="bg-input-background text-start focus:outline-none tet-white h-10 rounded-lg px-5 py-4 w-full" type="text" name={name} value={state} onChange={(e)=>(setState(e.target.value))} />
      </div>
    </div>
  );
}

export default Input;

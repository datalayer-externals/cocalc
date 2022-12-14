// DEPRECATED!

import { createContext, useContext, useState } from "react";

export interface EditableContextType {
  counter: number;
  save: (obj: object, change: object) => Promise<void>;
}

async function save(_obj: object, _change: object): Promise<void> {
  throw Error("please try to save again later");
}

export const EditableContext = createContext<EditableContextType>({
  counter: 0,
  save,
});

export function useEditableContext(): {
  edit: boolean;
  setEdit: (boolean) => void;
  saving: boolean;
  setSaving: (boolean) => void;
  error: string;
  setError: (string) => void;
  save: (obj: object, change: object) => Promise<void>;
  counter: number;
} {
  const context = useContext(EditableContext);
  const [edit, setEdit] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  async function save(obj: object, change: object) {
    try {
      setError("");
      setSaving(true);
      context.save(obj, change);
      setEdit(false);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setSaving(false);
    }
  }
  return {
    edit,
    setEdit,
    saving,
    setSaving,
    error,
    setError,
    save,
    counter: context.counter,
  };
}

import { Page, Form, Checkbox, TextField, Button } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function PopupConfigPage() {
  const [timeOut, setTimeOut] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSubmit = useCallback(() => {}, []);

  const handleChangeTimeOut = useCallback((value) => setTimeOut(value), []);

  const handleChangeInterval = useCallback(
    (newChecked) => setChecked(newChecked),
    [],
  );

  return (
    <Page>
      <h1>Config Popup</h1>
      <Form onSubmit={handleSubmit}>
        <Checkbox
          label="Interval"
          checked={checked}
          onChange={handleChangeInterval}
        />

        <TextField
          value={timeOut}
          onChange={handleChangeTimeOut}
          label="Set Time Out (s)"
          type="number"
        />

        <Button submit>Submit</Button>
      </Form>
    </Page>
  );
}

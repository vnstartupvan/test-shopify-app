import { useState, useCallback } from "react";
import {
  Form,
  FormLayout,
  Checkbox,
  TextField,
  Button,
  Page,
} from "@shopify/polaris";

export default function PopupPage() {
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [checked, setChecked] = useState(false);

  const handleChangeTimeOut = useCallback((value) => setTimeOut(value), []);

  const handleSubmit = useCallback(() => {
    setTitle("");
    setImageURL("");
    setTimeOut("");
    setChecked(fasle);
  }, []);


  const handleChangeInterval = useCallback(
    (newChecked) => setChecked(newChecked),
    [],
  );

  const handleTitleChange = useCallback((value) => setTitle(value), []);

  const handleImageURL = useCallback((value) => setImageURL(value), []);

  return (
    <Page>
      <h1>Popup Admin</h1>

      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <TextField value={title} onChange={handleTitleChange} label="Title" />

          <TextField
            value={imageURL}
            onChange={handleImageURL}
            label="Image URL"
          />

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
        </FormLayout>
      </Form>
    </Page>
  );
}

import { useState, useCallback } from "react";
import db from "../db.server";
import {
  Form,
  FormLayout,
  Checkbox,
  TextField,
  Button,
  Page,
} from "@shopify/polaris";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader() {
  // provides data to the component
  let popup = {
    title: "title",
    des: "des",
    imageURL: "imageURL",
  };

  return json(popup);
}

export default function PopupPage() {
  const popupData = useLoaderData();
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [imageURL, setImageURL] = useState("");
  const submit = useSubmit();

  const handleSubmit = useCallback(() => {
    console.log({title, des, imageURL});
    submit({ title, des, imageURL }, { method: "post" });
    // setTitle("");
    // setImageURL("");
  }, []);

  const handleChangeDes = useCallback((value) => setDes(value), []);

  const handleTitleChange = useCallback((value) => setTitle(value), []);

  const handleImageURL = useCallback((value) => setImageURL(value), []);

  return (
    <Page>
      <h1>Add new popup</h1>

      <Form method="POST" onSubmit={handleSubmit} action="/app/popup">
        <FormLayout>
          <TextField value={title} onChange={handleTitleChange} label="Title" />

          <TextField
            value={imageURL}
            onChange={handleImageURL}
            label="Image URL"
          />

          <TextField
            value={des}
            onChange={handleChangeDes}
            label="Description"
          />

          <Button submit={true}>Submit</Button>
        </FormLayout>
      </Form>
    </Page>
  );
}

export async function action({ request }) {
  // updates persistent data
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  let formData = await request.formData();

  formData = Object.fromEntries(formData.entries());
  console.log("dataform", formData);

  const popup = await db.popup.create({
    data: {
      title: formData.title,
      description: formData.des,
      imageURL: formData.imageURL,
      shop,
    },
  });

  console.log("insterted new popup: ", popup);
  return json({
    message: "insterted new popup",
  });
}

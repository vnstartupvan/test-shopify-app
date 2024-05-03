import { Page, Form, Checkbox, TextField, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import TableIndexComponent from "../components/TableIndex";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
  query {
    products (first: 250) {
      nodes {
        id
        title
        handle
      }
  }
  }`,
  );

  const data = await response.json();

  return data
}

export default function PopupConfigPage() {
  const { data } = useLoaderData();
  const defaultConditionConfig = {
    displayAllProductPage: false,
    displayAllCollectionPage: false,
    displayOnSpecificProductPages: false,
    displayOnSpecificCollectionPages: false,
    displayOnSpecificURLPages: false,
  };

  const [conditionConfig, setConditionConfig] = useState(
    defaultConditionConfig,
  );
  const [timeOut, setTimeOut] = useState("");
  const [checked, setChecked] = useState(false);
  const [pageList, setPageList] = useState(data.products.nodes);
  const submit = useSubmit();

  //request api to get the store configuration and change the configurations on the UI
  // useEffect(() => {
  //   console.log(conditionConfig);
  // }, [conditionConfig]);

  const handleConditionSubmit = useCallback(() => {
    submit(conditionConfig, { method: "post" });
  }, [conditionConfig]);

  const handleChangeTimeOut = useCallback((value) => setTimeOut(value), []);

  const handleChangeInterval = useCallback(
    (newChecked) => setChecked(newChecked),
    [],
  );

  const handleChangeConditions = useCallback((value, key) => {
    const updatedConditions = { ...conditionConfig };
    updatedConditions[key] = value;

    setConditionConfig(updatedConditions);
  });

  const handleSubmit = useCallback(() => {}, []);
  console.log("render");

  return (
    <Page>
      {/* general configurations */}
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
      {/* condition configurations */}
      <Form onSubmit={handleConditionSubmit}>
        {/* Show on page (home pages/ collection pages/ checkout page/ blog pages) */}
        <Checkbox
          label="Display on all product pages"
          checked={conditionConfig.displayAllProductPage}
          onChange={(e) => handleChangeConditions(e, "displayAllProductPage")}
        />

        <Checkbox
          label="Display on all collection pages"
          checked={conditionConfig.displayAllCollectionPage}
          onChange={(e) =>
            handleChangeConditions(e, "displayAllCollectionPage")
          }
        />

        <Checkbox
          label="Display on specify product pages"
          checked={conditionConfig.displayOnSpecificProductPages}
          onChange={(e) =>
            handleChangeConditions(e, "displayOnSpecificProductPages")
          }
        />

        <Checkbox
          label="Display on specify collection pages"
          checked={conditionConfig.displayOnSpecificCollectionPages}
          onChange={(e) =>
            handleChangeConditions(e, "displayOnSpecificCollectionPages")
          }
        />

        <Checkbox
          label="Display on specify URL pages"
          checked={conditionConfig.displayOnSpecificURLPages}
          onChange={(e) =>
            handleChangeConditions(e, "displayOnSpecificURLPages")
          }
        />

        <Button submit={true}>Submit</Button>

        <TableIndexComponent pageList={pageList} />
        {/* Show on product pages */}

        {/* Show on collections */}
      </Form>
    </Page>
  );
}

export async function action({ request }) {
  // updates persistent data
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  let formData = await request.formData();

  function stringToBoolean(str) {
    // Convert the string to lowercase for case-insensitive comparison
    str = str.toLowerCase().trim();
    return str === "true" || str === "yes" || str === "1" || str === "on";
  }
  console.log("form data", formData);

  const conditionConfig = await db.popupConditionConfig.upsert({
    where: {
      shop: shop,
    },
    update: {
      displayAllProductPage: stringToBoolean(
        formData.get("displayAllProductPage"),
      ),
      displayAllCollectionPage: stringToBoolean(
        formData.get("displayAllCollectionPage"),
      ),
      displayOnSpecificProductPages: stringToBoolean(
        formData.get("displayOnSpecificProductPages"),
      ),
      displayOnSpecificCollectionPages: stringToBoolean(
        formData.get("displayOnSpecificCollectionPages"),
      ),
      displayOnSpecificURLPages: stringToBoolean(
        formData.get("displayOnSpecificURLPages"),
      ),
    },
    create: {
      displayAllProductPage: stringToBoolean(
        formData.get("displayAllProductPage"),
      ),
      displayAllCollectionPage: stringToBoolean(
        formData.get("displayAllCollectionPage"),
      ),
      displayOnSpecificProductPages: stringToBoolean(
        formData.get("displayOnSpecificProductPages"),
      ),
      displayOnSpecificCollectionPages: stringToBoolean(
        formData.get("displayOnSpecificCollectionPages"),
      ),
      displayOnSpecificURLPages: stringToBoolean(
        formData.get("displayOnSpecificURLPages"),
      ),
      shop,
    },
  });

  console.log("updated new config: ", conditionConfig);
  return json({
    message: "updated new config",
  });
}

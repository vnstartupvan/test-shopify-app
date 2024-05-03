import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from "@shopify/polaris";
import React from "react";

function TableIndexComponent({pageList}) {
  // console.log(pageList);
  if (!pageList) {
    return <></>;
  }

  const resourceName = {
    singular: "pageList",
    plural: "pageList",
  };

  console.log(pageList)
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pageList);

  const rowMarkup = pageList.map(({ id, title, handle }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{title}</IndexTable.Cell>
      <IndexTable.Cell>{handle}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={pageList.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Id" },
          { title: "Title" },
          { title: "URL" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}

export default TableIndexComponent;

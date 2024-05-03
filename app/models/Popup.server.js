import db from "../db.server";

export async function insertPopup(id, graphql) {
  const Popup = await db.popup.findFirst({ where: { id } });
  return Popup;
}

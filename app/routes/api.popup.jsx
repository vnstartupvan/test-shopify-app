import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function loader({ request }) {
  // const { admin, session } = await authenticate.admin(request);
  const popups = await db.popup.findMany({
    where: { shop: "ysydfashion.myshopify.com" },
  });

  console.log("popup data: ", popups);
  return json({
    ok: true,
    message: "ok",
    data: popups,
  });
}

export async function action({ request }) {
  const method = request.method;

  switch (method) {
    case "POST":
      return json({
        ok: true,
        msg: "POST",
      });
    case "PATCH":
      return json({
        ok: true,
        msg: "PATCH",
      });
    default:
      return new Response("Method not Allowed", { status: 405 });
  }
}

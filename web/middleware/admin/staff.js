import { Shopify } from "@shopify/shopify-api";
import * as Staff from "../../database/models/staff.js";
import * as Schedule from "../../database/models/schedule.js";

export default function applyAdminStaffMiddleware(app) {
  app.get("/api/admin/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    try {
      payload = await Staff.find();
    } catch (e) {
      console.log(
        `Failed to process api/admin/staff:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.post("/api/admin/staff", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { shop } = req.query;

    try {
      payload = await Staff.create({ shop, ...req.body });
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.get("/api/admin/staff/:staff/schedules", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { staff } = req.params;

    try {
      payload = await Schedule.find({ staff, ...req.query });
      console.log(payload);
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });

  app.post("/api/admin/staff/:staff/schedules", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;
    let payload = null;

    const { staff } = req.params;

    try {
      payload = await Schedule.create({ staff, ...req.body });
      console.log(payload);
    } catch (e) {
      console.log(
        `Failed to process api/metafields:
         ${e}`
      );
      status = 500;
      error = JSON.stringify(e, null, 2);
    }
    res.status(status).send({ success: status === 200, error, payload });
  });
}

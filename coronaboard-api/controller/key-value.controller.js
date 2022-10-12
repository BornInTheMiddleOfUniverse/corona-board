import db from "../database";
import wrapWithErrorHandler from "../util";

const get = async(req, res) => {
  const { key } = req.params;
  if (!key) {
    res.status(400).json({ error: "key is required" });
    return;
  }

  const result = await db.KeyValue.findOne({
    where: { key },
  });
  res.status(200).json({ result });
}

const insertOrUpdate = async(req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    res.status(400).json({ error: "key and value are required" });
    return;
  }

  await db.KeyValue.upsert({ key, value });

  res.status(200).json({ result: "success" });
}

const remove = async(req, res) => {
  const { key } = req.params;
  if (!key) {
    res.status(400).json({ error: "key is required" });
    return;
  }

  await db.KeyValue.destroy({
    where: { key },
  });

  res.status(200).json({ result: "success" });
}

export default wrapWithErrorHandler({
  get,
  insertOrUpdate,
  remove,
});

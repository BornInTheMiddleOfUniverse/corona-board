import { GlobalStat } from "../database";
import wrapWithErrorHandler from "../util";


const getAll = async (req, res) => {
  const result = await GlobalStat.findAll();
  res.status(200).json({ result });
}

const insertOrUpdate = async (req, res) => {
  const { cc, date } = req.body;
  if (!cc || !date) {
    res.status(400).json({ error: "cc and date are required" });
    return;
  }

  const count = await GlobalStat.count({ where: { cc, date } });
  if (count === 0) {
    await GlobalStat.create(req.body);
  } else {
    await GlobalStat.update(req.body, { where: { cc, date } });
  }
  res.status(200).json({ result: "success" });
}

const remove = async(req, res) => {
    const { cc, date } = req.body;
    if (!cc || !date) {
      res.status(400).json({ error: 'cc and date are required' });
      return;
    }
  
    await GlobalStat.destroy({
      where: {
        cc,
        date,
      },
    });
  
    res.status(200).json({ result: 'success' });
  }
  
  export default wrapWithErrorHandler({
    getAll,
    insertOrUpdate,
    remove,
  });
  
const pool = require("../config/db.config");
const { Parser } = require("json2csv"); 
exports.createTable = async (req, res) => {
  const { tableName, rows, columns, cells } = req.body;

  const [result] = await pool.query(
    "INSERT INTO tables (user_id, table_name, rows_count, columns_count, cells) VALUES (?, ?, ?, ?, ?)",
    [req.user.userId, tableName, rows, columns, JSON.stringify(cells)]
  );

  res.json({ id: result.insertId });
};

exports.getTables = async (req, res) => {
  const [tables] = await pool.query(
    "SELECT * FROM tables WHERE user_id = ?",
    [req.user.userId]
  );

  res.json(tables);
};

exports.getTableById = async (req, res) => {
  const [table] = await pool.query(
    "SELECT * FROM tables WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.userId]
  );

  res.json(table[0]);
};

exports.updateTable = async (req, res) => {
  const { tableName, rows, columns, cells } = req.body;

  await pool.query(
    "UPDATE tables SET table_name=?, rows_count=?, columns_count=?, cells=? WHERE id=? AND user_id=?",
    [tableName, rows, columns, JSON.stringify(cells), req.params.id, req.user.userId]
  );

  res.json({ message: "Table updated" });
};

exports.deleteTable = async (req, res) => {
  await pool.query(
    "DELETE FROM tables WHERE id=? AND user_id=?",
    [req.params.id, req.user.userId]
  );

  res.json({ message: "Table deleted" });
};


// Export table
exports.exportTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const format = req.query.format || "json"; // default json

    // Fetch table for this user
    const [rows] = await pool.query(
      "SELECT * FROM tables WHERE id = ? AND user_id = ?",
      [tableId, req.user.userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Table not found" });
    }

    const table = rows[0];
    const cells = JSON.parse(table.cells); // convert JSON string to array

    if (format === "csv") {
      // Convert 2D array to CSV
      // Flatten rows into objects with column names A, B, C...
      const data = cells.map(row => {
        const obj = {};
        row.forEach((cell, index) => {
          obj[String.fromCharCode(65 + index)] = cell; // 65 = 'A'
        });
        return obj;
      });

      const parser = new Parser();
      const csv = parser.parse(data);

      res.setHeader("Content-Disposition", `attachment; filename=${table.table_name}.csv`);
      res.setHeader("Content-Type", "text/csv");
      return res.send(csv);
    } else {
      // JSON export
      res.setHeader("Content-Disposition", `attachment; filename=${table.table_name}.json`);
      res.setHeader("Content-Type", "application/json");
      return res.json({
        tableName: table.table_name,
        rows: table.rows_count,
        columns: table.columns_count,
        cells
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

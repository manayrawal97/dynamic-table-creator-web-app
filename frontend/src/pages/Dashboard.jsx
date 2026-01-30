import api from "../api/api";
import { useEffect, useState } from "react";

// Helper functions
const colName = (i) => String.fromCharCode(65 + i);

const evalFormula = (value, cells) => {
  // Ensure value is always a string
  if (value === null || value === undefined) return "";
  if (typeof value !== 'string') return String(value);
  if (!value.startsWith("=")) return value;

  try {
    let exp = value.substring(1);

    exp = exp.replace(/[A-Z][0-9]+/g, (ref) => {
      const col = ref.charCodeAt(0) - 65;
      const row = parseInt(ref.slice(1)) - 1;

      const cellValue = cells[row]?.[col];

      if (!cellValue || (typeof cellValue === 'string' && cellValue.startsWith("="))) {
        return 0;
      }

      const num = parseFloat(cellValue);
      return isNaN(num) ? 0 : num;
    });

    const result = Function(`return ${exp}`)();
    return result !== undefined ? String(result) : "ERR";
  } catch {
    return "ERR";
  }
};

// Helper to safely get cell value (never undefined)

const getCellValue = (cell) => {
  if (cell === null || cell === undefined) return "";
  return String(cell);
};

// Evaluate all cells (convert formulas to results)
const evaluateCellsForSave = (cells) => {
  return cells.map((row) =>
    row.map((cell) => {
      const safeCell = getCellValue(cell);

      if (safeCell.startsWith("=")) {
        const result = evalFormula(safeCell, cells);
        return String(result);
      }

      return safeCell;
    })
  );
};

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [cells, setCells] = useState([]);
  const [editingCell, setEditingCell] = useState(null); // Track which cell is being edited

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data);
    } catch (error) {
      console.error("Failed to load tables:", error);
    }
  };

  const createTable = async () => {
    try {
      await api.post("/tables", {
        tableName: "New Table",
        rows: 1,
        columns: 1,
        cells: [[""]],
      });
      loadTables();
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  };
  const downloadFile = async (id, format) => {
    const res = await api.get(
      `/tables/${id}/export?format=${format}`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `table.${format}`;
    a.click();
  };

  const openTable = async (id) => {
    try {
      const res = await api.get(`/tables/${id}`);
      setActiveTable(res.data);
      const rawCells = JSON.parse(res.data.cells);

      // Normalize cells - ensure no undefined/null values
      const normalized = rawCells.map((row) =>
        row.map((cell) => getCellValue(cell))
      );

      setCells(normalized);
    } catch (error) {
      console.error("Failed to open table:", error);
    }
  };

  const addRow = () => {
    if (cells.length === 0 || cells[0].length === 0) {
      setCells([[""]]);
      return;
    }
    setCells([...cells, Array(cells[0].length).fill("")]);
  };

  const addColumn = () => {
    if (cells.length === 0) {
      setCells([[""]]);
      return;
    }
    setCells(cells.map((r) => [...r, ""]));
  };

  const deleteRow = (i) => {
    if (cells.length === 1) return;
    setCells(cells.filter((_, idx) => idx !== i));
  };

  const deleteColumn = (i) => {
    if (cells[0].length === 1) return;
    setCells(cells.map((r) => r.filter((_, idx) => idx !== i)));
  };

  const updateCell = (r, c, val) => {
    const copy = cells.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return val ?? ""; // Ensure never undefined
        }
        return cell;
      })
    );
    setCells(copy);
  };


  const saveTable = async () => {
    try {
      // ✅ Evaluate all formulas before saving
      const evaluatedCells = evaluateCellsForSave(cells);

      await api.put(`/tables/${activeTable.id}`, {
        tableName: activeTable.table_name,
        rows: evaluatedCells.length,
        columns: evaluatedCells[0].length,
        cells: evaluatedCells,
      });

      // ✅ Update local state with evaluated values
      setCells(evaluatedCells);

      alert("Saved successfully!");
      loadTables();
    } catch (error) {
      console.error("Failed to save table:", error);
      alert("Failed to save");
    }
  };

  const deleteTable = async (id) => {
    try {
      await api.delete(`/tables/${id}`);
      loadTables();
    } catch (error) {
      console.error("Failed to delete table:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  // Get display value for a cell
  const getDisplayValue = (cell, r, c) => {
    const safeCell = getCellValue(cell);

    // If this cell is being edited, show raw value
    if (editingCell?.r === r && editingCell?.c === c) {
      return safeCell;
    }

    // Otherwise, evaluate formulas
    if (safeCell.startsWith("=")) {
      return evalFormula(safeCell, cells);
    }

    return safeCell;
  };

  if (activeTable) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => {
              setActiveTable(null);
              setEditingCell(null);
            }}
            className="border px-4 py-1 rounded"
          >
            ← Back
          </button>

          <div className="space-x-2">
            <button onClick={addRow} className="bg-gray-300 px-3 py-1 rounded">
              + Row
            </button>
            <button onClick={addColumn} className="bg-gray-300 px-3 py-1 rounded">
              + Column
            </button>
            <button
              onClick={saveTable}
              className="bg-orange-400 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>

        <table className="border bg-white">
          <thead>
            <tr>
              <th></th>
              {cells[0]?.map((_, c) => (
                <th key={c} className="border px-3">
                  {colName(c)}
                  <button
                    onClick={() => deleteColumn(c)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {cells.map((row, r) => (
              <tr key={r}>
                <td className="border px-2">
                  {r + 1}
                  <button
                    onClick={() => deleteRow(r)}
                    className="ml-2 text-red-500"
                  >
                    x
                  </button>
                </td>

                {row.map((cell, c) => (
                  <td key={c} className="border">
                    <input
                      className="p-2 w-24"
                      value={getDisplayValue(cell, r, c)}
                      onFocus={() => setEditingCell({ r, c })}
                      onBlur={() => setEditingCell(null)}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => downloadFile(activeTable.id, "csv")}
            className="border px-3 py-1 rounded"
          >
            Export CSV
          </button>

          <button
            onClick={() => downloadFile(activeTable.id, "json")}
            className="border px-3 py-1 rounded"
          >
            Export JSON
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-2xl font-bold">Table Creator</h1>
        <button onClick={logout} className="border px-4 rounded">
          Logout
        </button>
      </div>

      <div className="p-6">
        <button
          onClick={createTable}
          className="bg-orange-400 text-white px-6 py-2 rounded mb-6"
        >
          + New Table
        </button>

        <div className="grid md:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => openTable(t.id)}
            >
              <h3 className="font-semibold">{t.table_name}</h3>
              <p className="text-sm text-gray-500">
                {t.rows_count} x {t.columns_count}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTable(t.id);
                }}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  charterVarToColumn,
  charterVarToTable,
  charterUniqueTable,
} from "../config/Charter_Search_Config.js";
import { withDatabaseConnection } from "./Berth_Search.js";

const searchCharterRouter = Router();

searchCharterRouter.get("/charter", async (req, res) => {
  let connection;

  // console.log(req.headers);

  try {
    var tableNames = [];
    connection = await dbConnection.getConnection();
    const columnCheck = await connection.query(
      `SELECT COLUMN_NAME
         FROM information_schema.columns
         WHERE table_name = 'Accomodation'
         AND table_schema = 'Marisail'
         AND column_name = 'Guest_Capacity'`
    );

    // Check if the column exists
    if (columnCheck[0].length > 0) {
      console.log(columnCheck);
      console.log("inside if");
      const tables = await connection.query(
        `SELECT Guest_Capacity, COUNT(*) AS occurrence_cnt 
             FROM Accomodation 
             GROUP BY Guest_Capacity;`
      );

      console.log(tables[0]);
      tableNames = tables[0].map((table) => Object.values(table));
    }
    return res.status(200).json({ ok: true, tables: tableNames });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchCharterRouter.post("/charter", async (req, res) => {
  let connection;

  // console.log(req.body);
  const filter = req.body.filter;
  const tableName = charterVarToTable[req.body.tableName];
  // console.log("filter", filter);
  // console.log("req.body", req.body);

  try {
    connection = await dbConnection.getConnection();

    for (const key of Object.keys(filter)) {
      const columnCheck = await connection.query(
        `SELECT COLUMN_NAME
             FROM information_schema.columns
             WHERE table_name = '${tableName}'
             AND table_schema = 'Marisail'
             AND column_name = '${charterVarToColumn[key]}'`
      );

      // Check if the column exists
      if (columnCheck[0].length > 0) {
        // console.log(columnCheck )
        // console.log("inside if");
        const tables = await connection.query(
          `SELECT ${charterVarToColumn[key]}, COUNT(*) AS occurrence_cnt 
                 FROM ${tableName} 
                 GROUP BY ${charterVarToColumn[key]};`
        );

        console.log(tables[0]);
        filter[key] = tables[0].map((table) => Object.values(table));
        // console.log(filter);
      }
    }

    return res.status(200).json({ ok: true, res: filter });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchCharterRouter.post("/charterData", async (req, res) => {
  let connection;

  console.log(req.body);

  var page = req.body.page;
  var filter = {};
  for (const key of Object.keys(req.body.selectedOptions)) {
    let val = key,
      key2 = req.body.selectedOptions[key];
    console.log(key2);
    console.log(val);

    if (filter[key2] === undefined) {
      filter[key2] = [val];
    } else {
      filter[key2].push(val);
    }

    // console.log(key);
    // console.log(req.body[key]);
  }
  console.log("filter :>", filter);

  try {
    connection = await dbConnection.getConnection();

    // var required1 =
    //   "Summer_Cruising_Area, Boardingport_Time, Charter_ID FROM Charter_Location";
    var required1 =
      "Marisail_Charter_ID, Summer_Cruising_Areas, Boarding_Port FROM Location";
    // var required2 = "Price_PW FROM Pricing";

    var basic = `SELECT ${required1} `;
    if (Object.keys(filter).length > 0) {
      basic += `WHERE `;

      for (const key of Object.keys(filter)) {
        // console.log(key);
        // console.log(filter[key]);
        var temp = `${key} IN (`;
        for (const val of filter[key]) {
          temp += `'${val}',`;
        }
        temp = temp.slice(0, -1);
        temp += `) OR `;
        basic += temp;
      }
      console.log("basic  :>> ", basic);

      basic = basic.slice(0, -3);
    }

    basic += `LIMIT 60 OFFSET ${page * 30};`;
    basic += `;`;
    console.log("basic", basic);

    const tables = await connection.query(basic);

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

searchCharterRouter.get("/charter-detail/:id", async (req, res) => {
  console.log("Marisail Charter ID:", req.params.id);
  const { id } = req.params; // Get the engine ID from the URL parameter
  console.log(id);
  let connection;

  try {
    connection = await dbConnection.getConnection();

    var query = `SELECT`;

    charterUniqueTable.forEach((table) => {
      query += ` ${table}.*,`;
    });

    query = query.slice(0, -1);
    query += ` FROM ${charterUniqueTable[0]}`;

    for (let i = 1; i < charterUniqueTable.length; i++) {
      query += ` JOIN ${charterUniqueTable[i]} ON ${charterUniqueTable[0]}.Charter_ID = ${charterUniqueTable[i]}.Charter_ID`;
    }

    query += ` WHERE ${charterUniqueTable[0]}.Charter_ID = ${id};`;

    console.log(query);

    const tables = await connection.query(query);

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export const countDropDownCharters = async (
  connection,
  actualColumn,
  currentcolumn,
  appliedFilters,
  result
) => {
  delete appliedFilters[currentcolumn];
  if (!result || result.length === 0) return;

  var wherePart = "";

  for (const key of Object.keys(appliedFilters)) {
    var columnKey = charterVarToColumn[key];
    if (appliedFilters[key].length === 0) continue;
    wherePart += "(";
    for (const value of appliedFilters[key]) {
      if (columnKey === "Accommodation_Location")
        columnKey = "al.Accommodation_Location";
      wherePart += ` ${columnKey} = '${value}' OR`;
    }
    wherePart = wherePart.slice(0, -3);
    wherePart += ") AND ";
  }
  wherePart = wherePart.slice(0, -4);
  if (wherePart !== "") wherePart = `WHERE ${wherePart}`;
  var sumString = "";
  const diffValueOfResult = result.map((obj) => obj[actualColumn]);
  for (const obj of diffValueOfResult) {
    sumString += `SUM(CASE WHEN ${
      actualColumn === "Accommodation_Location"
        ? "al.Accommodation_Location"
        : actualColumn
    } = '${obj}' THEN 1 ELSE 0 END) AS \`${obj}\`,`;
  }

  var query = `SELECT ${sumString.slice(0, -1)} FROM Accommodation_Location al
LEFT JOIN Requirements req ON al.Accommodation_ID = req.Accommodation_ID
LEFT JOIN Policy pol ON al.Accommodation_ID = pol.Accommodation_ID
LEFT JOIN Safety_Measures sm ON al.Accommodation_ID = sm.Accommodation_ID
LEFT JOIN Charter_Costs cc ON al.Accommodation_ID = cc.Accommodation_ID
LEFT JOIN Dates d ON al.Accommodation_ID = d.Accommodation_ID
LEFT JOIN Charter_Payment cp ON al.Accommodation_ID = cp.Accommodation_ID
LEFT JOIN Charter_Sales cs ON al.Accommodation_ID = cs.Accommodation_ID
${wherePart}
;`;

  const [check] = await connection.query(query, []);
  result.map((item) => {
    // Find the matching value from the check array
    const itemCount = check[0][item[actualColumn]];

    if (itemCount) {
      // Add the check value to occurrence_cnt
      item.occurrence_cnt = parseInt(itemCount);
    }
    return item;
  });
};
export default searchCharterRouter;

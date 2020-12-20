import knex from "knex";
import dotenv from "dotenv";
import { tableStructure } from "./functionsExports";
dotenv.config();
let db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_INITIAL,
});
export const buildDatabase = async () => {
  const searchForDatabase = await db
    .select("datname")
    .from("pg_database")
    .where("datname", "eurovision")
    .pluck("datname");
  const databaseExists = searchForDatabase[0];
  if (databaseExists)
    db = knex({
      client: "pg",
      connection: process.env.PG_CONNECTION_EUROVISION,
    });
  else {
    await db.raw("CREATE DATABASE eurovision");
    db = knex({
      client: "pg",
      connection: process.env.PG_CONNECTION_EUROVISION,
    });
  }
  const eurovisionTableExists = await db.schema.hasTable("eurovision");
  if (!eurovisionTableExists)
    await db.schema.createTable("eurovision", (table) => {
      for (const column of tableStructure) {
        const { method, name, nullable, maxLength } = column;
        nullable
          ? table[method](name, maxLength)
          : table[method](name, maxLength).notNullable();
      }
      table.primary(["country", "year"]);
    });
  else {
    const columnsInfo = await db("eurovision").columnInfo();
    for (const column of tableStructure) {
      const { name, method, maxLength, nullable } = column;
      const columnInfo = columnsInfo[name];
      if (columnInfo) {
        const rightType = columnInfo.type === column.type;
        const rightMaxLength = columnInfo.maxLength === column.maxLength;
        const rightNullable = columnInfo.nullable === column.nullable;
        if (!rightType || !rightMaxLength || !rightNullable)
          await db.schema.alterTable("eurovision", (table) => {
            nullable
              ? table[method](name, maxLength)
              : table[method](name, maxLength).notNullable();
          });
      } else {
        await db.schema.table("eurovision", (table) => {
          nullable
            ? table[method](name, maxLength)
            : table[method](name, maxLength).notNullable();
        });
      }
    }

    const primaryKeys = await db
      .select("pg_attribute.attname")
      .from("pg_index")
      .joinRaw(
        `JOIN pg_attribute 
         ON pg_attribute.attrelid = pg_index.indrelid
         AND pg_attribute.attnum = ANY (pg_index.indkey )`
      )
      .whereRaw("pg_index.indrelid = 'eurovision'::regclass")
      .andWhere("pg_index.indisprimary", true)
      .pluck("attname");
    const expectedPrimaryKeys = ["country", "year"];
    const sameLength = primaryKeys.length === expectedPrimaryKeys.length;
    const samePrimaryKeys = sameLength
      ? primaryKeys.every(
          (value, index) => value === expectedPrimaryKeys[index]
        )
      : false;
    if (!(sameLength && samePrimaryKeys)) {
      await db.schema.table("eurovision", (table) => {
        table.primary(["country", "year"]);
      });
    }
  }
  console.log("Built");
  return "Built.";
};
buildDatabase();

import db_connection from "../config/dbConfig.js";
import { Router } from "express";
import { 
initialize_service,  handle_error_response, execute_operation_with_retry } from "../utils/Common_Utils.js";

const advert_router = Router();


// VALIDATION MIDDLEWARE

const validate_mandatory_fields = (request, response, next) => {
    const { tables } = request.service_config;
    const missing_fields = [];
    tables.forEach(table => {
        Object.entries(table.columns).forEach(([key, config]) => {
            if (config.mandatory && (request.body[key] === undefined || request.body[key] === null || request.body[key] === '')) {
                missing_fields.push(key);
            }
        });
    });
    if (missing_fields.length > 0) {
        return handle_error_response(response, `Missing mandatory fields: ${missing_fields.join(', ')}`, 400);
    }
    next();
};

// THE SUBMIT ROUTE

advert_router.post("/:service_name/submit", initialize_service, validate_mandatory_fields, async (request, response) => {
    
    

    const submit_operation = async () => {
        const connection = await db_connection.getConnection();
        try {
            await connection.beginTransaction();
            const { service_config, service_mappings } = request;
            const { main_table, primary_key } = service_config;
            const { var_to_table, var_to_column } = service_mappings;
            const data_by_table = {};

            for (const key in request.body) {
                const table_Name = var_to_table[key];
                const column_name = var_to_column[key];
                if (table_Name && column_name) {
                    if (!data_by_table[table_Name]) data_by_table[table_Name] = {};
                    data_by_table[table_Name][column_name] = request.body[key];
                }
            }
            
            const main_data = data_by_table[main_table];
            if (!main_data) throw new Error(`No data provided for the main table: ${main_table}`);
            
            const [insert_result] = await connection.query(`INSERT INTO \`${main_table}\` SET ?`, [main_data]);
            const new_id = insert_result.insertId;

            for (const table_Name in data_by_table) {
                if (table_Name !== main_table) {
                    const join_data = { [primary_key]: new_id, ...data_by_table[table_Name] };
                    await connection.query(`INSERT INTO \`${table_Name}\` SET ?`, [join_data]);
                }
            }
            
            await connection.commit();
            return { new_id };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    };

  
    
    try {
        const { new_id } = await execute_operation_with_retry(submit_operation);
        response.status(201).json({ ok: true, message: "Submission successful", new_id: new_id });
    } catch (err) {
        handle_error_response(response, `Submit failed after multiple attempts: ${err.message}`);
    }
});

export default advert_router;


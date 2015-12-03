CREATE TYPE table_struct AS (
	"field" varchar(50),
	"index" int,
	"type" VARCHAR(20),
	"allowNull" bool,
	"defaultValue" VARCHAR(100),
	"comment" VARCHAR(500),
	"unique" bool,
	"primaryKey" bool
);
	
CREATE OR REPLACE FUNCTION to_sequelize_data_type(field_type varchar) RETURNS varchar AS
$BODY$
DECLARE
	 func_result varchar;
BEGIN
		IF field_type = 'int8' THEN func_result := 'BIGINT';
		ELSIF field_type = 'int4' THEN func_result := 'INTEGER';
		ELSIF field_type = 'int2' THEN func_result := 'INTEGER';
		ELSIF field_type = 'bpchar' THEN func_result := 'CHAR';
		ELSIF field_type = 'timestamp' THEN func_result := 'TIME';
		ELSIF field_type = 'json' THEN func_result := 'JSONTYPE';
	ELSE
		func_result := upper(field_type);
	 END IF;
	 RETURN func_result;
END;
$BODY$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION describe_table_info(schema_name varchar, table_name varchar) RETURNS SETOF table_struct AS
$body$
DECLARE
	 t_struct table_struct;
	 sql_str varchar;
	 func_result RECORD;
BEGIN
	 

	sql_str='
		(SELECT
		pg_attribute.attname "field",
		pg_attribute.attnum "index",
		to_sequelize_data_type(pg_type.typname::varchar) "type",
		not pg_attribute.attnotnull "allowNull",
		COALESCE(pg_attrdef.adsrc, '''') "defaultValue",
		COALESCE(pg_description.description, '''') "comment",
		COALESCE(indisunique, false) "unique",
		COALESCE(indisprimary, false) "primaryKey"
	FROM
		pg_attribute
		INNER JOIN pg_class  ON (pg_attribute.attrelid = pg_class.oid and pg_class.relname=''' || table_name || ''')
		INNER JOIN pg_namespace on (pg_class.relnamespace = pg_namespace.oid AND lower(pg_namespace.nspname) = ''' || schema_name || ''')
		INNER JOIN pg_type   ON pg_attribute.atttypid = pg_type.oid
		LEFT OUTER JOIN pg_attrdef ON pg_attrdef.adrelid = pg_class.oid AND pg_attrdef.adnum = pg_attribute.attnum
		LEFT OUTER JOIN pg_description ON pg_description.objoid = pg_class.oid AND pg_description.objsubid = pg_attribute.attnum		
		LEFT JOIN (select attrelid t_oid, attname f_name, indisunique, indisprimary from pg_attribute 
		inner JOIN pg_index on (pg_index.indisunique = true and pg_index.indrelid = pg_attribute.attrelid 
		and pg_attribute.attnum::varchar = pg_index.indkey::varchar)) u_j
		on (u_j.t_oid = pg_attribute.attrelid and u_j.f_name = pg_attribute.attname)
	WHERE
		pg_attribute.attnum > 0
		AND attisdropped <> ''t''
	ORDER BY "index")
	union all
	(
		'SELECT
        pa.attname "field",
        pa.attnum "index",
        pt.typname "type",
        true "allowNull",
        '''' "defaultValue",
        '''' "comment",
        false "unique",
        false "primaryKey"
        from
        pg_attribute pa
        INNER JOIN pg_class pc on (pc.relkind=''v'' and pc.relname=''' || table_name || ''' and pa.attrelid = pc.oid)
        INNER JOIN pg_namespace pn on (pc.relnamespace = pn.oid AND lower(pn.nspname) = ''' || schema_name || ''')
        INNER JOIN pg_type pt ON (pa.atttypid = pt.oid)'
	)
	';

	FOR func_result IN EXECUTE sql_str LOOP
		t_struct."field" = func_result."field";
		t_struct."index" = func_result."index";
		t_struct."type" = func_result."type";
		t_struct."allowNull" = func_result."allowNull";
		t_struct."defaultValue" = func_result."defaultValue";
		t_struct."comment" = func_result."comment";
		t_struct."unique" = func_result."unique";
		t_struct."primaryKey" = func_result."primaryKey";
	 RETURN NEXT t_struct;
	END LOOP;
	RETURN ;
END;
$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

COMMENT ON FUNCTION describe_table_info(schema_name varchar, table_name varchar)
IS '获得表信息';

---
CREATE OR REPLACE FUNCTION describe_table_info(table_name varchar) RETURNS SETOF table_struct AS
$body$
DECLARE
	t_struct table_struct;
BEGIN
	FOR t_struct IN SELECT * FROM describe_table_info('public', table_name) LOOP
		RETURN NEXT t_struct;
	END LOOP;
	RETURN;
END;
$body$
LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;

COMMENT ON FUNCTION describe_table_info(table_name varchar)
IS '获得表信息';
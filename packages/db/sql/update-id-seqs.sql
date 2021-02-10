-- execute in case you have bad id_seqs for table (e.g. after import database)
do $$
  declare
    arow record;
  begin
    for arow IN
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
	loop
      execute 'SELECT setval(''' || arow.table_name || '_id_seq'', (SELECT MAX(id) FROM "' || arow.table_name || '") + 1);';
    end loop;
  end;
$$

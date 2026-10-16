#!/usr/bin/env bash
# Applies the Supabase migrations to a throwaway local PostgreSQL database and
# runs the SQL test suite. Requires a local PostgreSQL 15+ server.
#   PGHOST/PGUSER/etc. are respected; defaults to the local `postgres` superuser.
set -euo pipefail
cd "$(dirname "$0")/../.."
DB="${VELETA_TEST_DB:-veleta_test}"
PSQL=(psql -X -q -v ON_ERROR_STOP=1)
if [ "$(id -u)" = "0" ] && [ -z "${PGUSER:-}" ]; then RUN=(su postgres -c); else RUN=(bash -c); fi
q() { "${RUN[@]}" "$*"; }
q "dropdb --if-exists $DB" >/dev/null
q "createdb $DB"
q "${PSQL[*]} -d $DB -f supabase/tests/supabase_stub.sql" >/dev/null
for f in supabase/migrations/*.sql; do
  q "${PSQL[*]} -d $DB -f $f" >/dev/null
done
status=0
for t in supabase/tests/*.test.sql; do
  echo "▶ $t"
  if ! q "${PSQL[*]} -d $DB -f $t -o /dev/null"; then status=1; fi
done
[ "${KEEP_DB:-0}" = "1" ] || q "dropdb --if-exists $DB" >/dev/null
exit $status

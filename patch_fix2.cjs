const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

// Fix TestimonialsAdmin
code = code.replace(
  /function TestimonialsAdmin\(\) \{\n  const \{ data: items = \[\] \} = useQuery\(adminTestimonialsQuery\);\n  const qc = useQueryClient\(\);/,
  `function TestimonialsAdmin() {
  const { data: items = [] } = useQuery(adminTestimonialsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);`
);

code = code.replace(
  /const mutateDb = useServerFn\(adminMutateDb\);\n        const result = await mutateDb\(\{/g,
  `const result = await mutateDb({`
);

// Fix AdminsAdminBody
code = code.replace(
  /function AdminsAdminBody\(\) \{\n  const \{ data: accounts = \[\] \} = useQuery\(adminAccountsQuery\);\n  const qc = useQueryClient\(\);/,
  `function AdminsAdminBody() {
  const { data: accounts = [] } = useQuery(adminAccountsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);`
);

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", code);
console.log("Hooks fixed.");


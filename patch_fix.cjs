const fs = require("fs");
let code = fs.readFileSync("d:/Zmiiras/src/routes/admin.tsx", "utf-8");

const from = `function SettingsAdmin() {
  const { data: settings, isLoading } = useQuery(siteSettingsQuery);
  const qc = useQueryClient();
  const [state, setState] = useState<Record<string, unknown> | null>(null);`;

const to = `function SettingsAdmin() {
  const { data: settings, isLoading } = useQuery(siteSettingsQuery);
  const qc = useQueryClient();
  const mutateDb = useServerFn(adminMutateDb);
  const [state, setState] = useState<Record<string, unknown> | null>(null);`;

code = code.replace(from, to);

const from2 = `      const mutateDb = useServerFn(adminMutateDb);\n      const result = await mutateDb({`;
const to2 = `      const result = await mutateDb({`;

code = code.replace(from2, to2);

fs.writeFileSync("d:/Zmiiras/src/routes/admin.tsx", code);
console.log("Patched Invalid Hook successfully.");


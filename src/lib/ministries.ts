export type Ministry = {
  id: string;
  code: string;
  name: string;
  full: string;
  color: string;
  capabilities: string[];
  endpoints: { name: string; method: string; path: string }[];
  // polar coords for ring layout
  angle: number;
};

export const HUB = { id: "hub", name: "NGDXH Core", code: "HUB" };

export const MINISTRIES: Ministry[] = [
  { id: "nira", code: "NIRA", name: "NIRA", full: "National Identification & Registration Authority", color: "oklch(0.7 0.18 255)", angle: 0,
    capabilities: ["Identity verification", "NIN validation", "Citizen status", "Biometric match"],
    endpoints: [
      { name: "Verify NIN", method: "POST", path: "/v1/identity/verify" },
      { name: "Citizen profile", method: "GET", path: "/v1/citizen/{nin}" },
    ] },
  { id: "ura", code: "URA", name: "URA", full: "Uganda Revenue Authority", color: "oklch(0.78 0.14 85)", angle: 40,
    capabilities: ["Tax compliance", "TIN validation", "VAT status", "Customs clearance"],
    endpoints: [
      { name: "TIN lookup", method: "GET", path: "/v1/tax/tin/{nin}" },
      { name: "Compliance status", method: "GET", path: "/v1/tax/status" },
    ] },
  { id: "moh", code: "MOH", name: "Health", full: "Ministry of Health", color: "oklch(0.7 0.16 155)", angle: 80,
    capabilities: ["Health facility records", "Insurance verification", "Immunisation"],
    endpoints: [
      { name: "Insurance check", method: "POST", path: "/v1/health/insurance" },
      { name: "Facility lookup", method: "GET", path: "/v1/health/facilities" },
    ] },
  { id: "lands", code: "MLHUD", name: "Lands", full: "Ministry of Lands, Housing & Urban Development", color: "oklch(0.65 0.15 35)", angle: 120,
    capabilities: ["Land ownership", "Title validation", "Parcel registry"],
    endpoints: [
      { name: "Ownership lookup", method: "GET", path: "/v1/lands/owner/{nin}" },
    ] },
  { id: "mowt", code: "MoWT", name: "Works & Transport", full: "Ministry of Works & Transport", color: "oklch(0.72 0.12 220)", angle: 160,
    capabilities: ["Driving permit", "Vehicle registration", "Road safety"],
    endpoints: [
      { name: "Permit check", method: "GET", path: "/v1/transport/permit/{nin}" },
    ] },
  { id: "police", code: "UPF", name: "Police / Justice", full: "Uganda Police Force & Judiciary", color: "oklch(0.62 0.2 25)", angle: 200,
    capabilities: ["Criminal clearance", "Case status", "Court records"],
    endpoints: [
      { name: "Criminal record", method: "GET", path: "/v1/justice/clearance/{nin}" },
    ] },
  { id: "moes", code: "MoES", name: "Education", full: "Ministry of Education & Sports", color: "oklch(0.7 0.15 195)", angle: 240,
    capabilities: ["Academic records", "Certificate validation", "Institution registry"],
    endpoints: [
      { name: "Certificate verify", method: "POST", path: "/v1/education/verify" },
    ] },
  { id: "immig", code: "DCIC", name: "Immigration", full: "Directorate of Citizenship & Immigration Control", color: "oklch(0.68 0.16 305)", angle: 280,
    capabilities: ["Passport status", "Visa records", "Border crossings"],
    endpoints: [
      { name: "Passport check", method: "GET", path: "/v1/immigration/passport/{nin}" },
    ] },
  { id: "ucc", code: "UCC", name: "UCC", full: "Uganda Communications Commission", color: "oklch(0.72 0.12 280)", angle: 320,
    capabilities: ["SIM registration", "Telecom records", "Spectrum licensing"],
    endpoints: [
      { name: "SIM lookup", method: "GET", path: "/v1/ucc/sim/{nin}" },
    ] },
];

export const MOCK_CITIZEN = {
  nin: "CM900112ABCDE",
  name: "Nakato Aisha Mirembe",
  dob: "1990-01-12",
  sex: "Female",
  district: "Kampala Central",
  parish: "Nakasero II",
  village: "Plot 18, Kira Road",
  tribe: "Muganda",
  religion: "Muslim",
  maritalStatus: "Married",
  mother: "Namusoke Joy Mirembe",
  father: "Ssebunya Edward Mirembe",
  spouse: "Kato David Lubega · CM880711XYZ12",
  dependants: 2,
  phone: "+256 772 458 119",
  email: "a.nakato@mirembe.ug",
  photoInitial: "NA",
  riskScore: 12,
  faceMatchConfidence: 98.7,
  records: {
    nira: { status: "Verified", note: "Active citizen · valid until 2031" },
    ura: { status: "Compliant", note: "TIN 1000452918 · No outstanding tax" },
    moh: { status: "Insured", note: "NHIS Active · Mulago National Referral" },
    lands: { status: "Owner", note: "2 parcels · Wakiso, Mukono" },
    mowt: { status: "Valid", note: "DL-CB Class · expires 2028-04-19" },
    police: { status: "Clear", note: "No criminal record on file" },
    moes: { status: "Verified", note: "BSc Computer Science · Makerere 2014" },
    immig: { status: "Valid", note: "Passport B1234567 · expires 2030-09-02" },
    ucc: { status: "Registered", note: "3 SIMs · All KYC verified" },
  } as Record<string, { status: string; note: string }>,
  // Deep dossier (richer profiling than the legacy UG Hub)
  vehicles: [
    { plate: "UBJ 482K", make: "Toyota Harrier 2018", color: "Pearl White", status: "Active · Insured" },
    { plate: "UAX 901P", make: "Suzuki Alto 2015", color: "Silver", status: "Active · Insured" },
  ],
  properties: [
    { title: "FRV 4521 / Block 244 Plot 18", location: "Kira, Wakiso", type: "Residential", size: "0.25 ha" },
    { title: "LRV 1187 / Block 88 Plot 4", location: "Mukono Central", type: "Commercial", size: "0.12 ha" },
  ],
  taxHistory: [
    { year: "FY 2024/25", paye: "UGX 4,820,000", vat: "UGX 1,210,000", status: "Filed" },
    { year: "FY 2023/24", paye: "UGX 4,140,000", vat: "UGX 980,000", status: "Filed" },
    { year: "FY 2022/23", paye: "UGX 3,720,000", vat: "UGX 612,000", status: "Filed" },
  ],
  criminal: [] as { caseNo: string; offence: string; status: string; date: string }[],
  education: [
    { award: "BSc Computer Science", institution: "Makerere University", year: "2014" },
    { award: "UACE", institution: "Gayaza High School", year: "2010" },
  ],
  employment: [
    { employer: "Stanbic Bank Uganda", role: "Senior Data Engineer", since: "2019", status: "Active" },
  ],
  health: [
    { facility: "Mulago National Referral", visit: "2025-08-12", note: "Routine check-up", flag: "Restricted · MoH only" },
  ],
  telecom: [
    { msisdn: "+256 772 458 119", network: "MTN", kyc: "Verified", since: "2014" },
    { msisdn: "+256 700 219 884", network: "Airtel", kyc: "Verified", since: "2018" },
    { msisdn: "+256 393 100 552", network: "UCC-FIXED", kyc: "Verified", since: "2021" },
  ],
  travel: [
    { date: "2025-06-12", port: "Entebbe → DXB", carrier: "Emirates EK730", purpose: "Business" },
    { date: "2024-11-03", port: "Entebbe → NBO", carrier: "Kenya Airways KQ413", purpose: "Tourism" },
  ],
};


export const ROLES = [
  { id: "agency", title: "Agency Administrator", desc: "Inter-agency super-access · NGDXH oversight", color: "gold", grants: ["nira","ura","moh","lands","mowt","police","moes","immig","ucc"], denies: [] },
  { id: "nira", title: "NIRA Officer", desc: "Identity & civil registration", color: "primary", grants: ["nira"], denies: ["police", "moh"] },
  { id: "ura", title: "URA Officer", desc: "Revenue & taxation", color: "gold", grants: ["ura", "nira"], denies: ["moh", "police"] },
  { id: "moh", title: "Health Officer", desc: "Health & insurance", color: "success", grants: ["moh", "nira"], denies: ["police", "ura", "lands"] },
  { id: "lands", title: "Lands Officer", desc: "Land & property", color: "warning", grants: ["lands", "nira"], denies: ["moh", "police"] },
  { id: "mowt", title: "Transport Officer", desc: "Permits, vehicles & licensing", color: "primary", grants: ["mowt", "nira", "police"], denies: ["moh"] },
  { id: "police", title: "Police Officer", desc: "Justice & law enforcement", color: "destructive", grants: ["police", "nira", "immig", "mowt"], denies: ["moh"] },
  { id: "immig", title: "Immigration Officer", desc: "Borders, passports & visas", color: "primary", grants: ["immig", "nira", "police"], denies: ["moh"] },
  { id: "admin", title: "System Auditor", desc: "Read-only governance & audit logs", color: "primary", grants: ["nira","ura","moh","lands","mowt","police","moes","immig","ucc"], denies: [] },
];

/**
 * Demo credentials. For showcase only — every officer uses the same PIN.
 * Officer IDs are generated deterministically from the role id.
 */
export const DEMO_PIN = "240194";
export const DEMO_CREDENTIALS = ROLES.map((r, i) => ({
  role: r.id,
  title: r.title,
  officerId: `OFC-2026-${String(118 + i).padStart(4, "0")}`,
  pin: DEMO_PIN,
}));


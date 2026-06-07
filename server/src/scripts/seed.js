import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { Lead } from "../models/Lead.js";

const sampleLeads = [
  {
    name: "Avery Brooks",
    email: "avery@northstarretail.com",
    phone: "+1 415 555 0132",
    companyName: "Northstar Retail",
    status: "New",
    notes: "Asked for pricing on a ten-seat rollout."
  },
  {
    name: "Maya Patel",
    email: "maya@brightpath.io",
    phone: "+1 212 555 0187",
    companyName: "BrightPath",
    status: "Contacted",
    notes: "Discovery call completed. Send security documentation."
  },
  {
    name: "Leo Martinez",
    email: "leo@harborlabs.com",
    phone: "+1 646 555 0194",
    companyName: "Harbor Labs",
    status: "Qualified",
    notes: "Budget confirmed. Interested in quarterly billing."
  },
  {
    name: "Priya Shah",
    email: "priya@solisdesign.co",
    phone: "+1 510 555 0166",
    companyName: "Solis Design Co.",
    status: "Converted",
    notes: "Converted after product walkthrough."
  },
  {
    name: "Ethan Cole",
    email: "ethan@ridgewaygroup.com",
    phone: "+1 303 555 0109",
    companyName: "Ridgeway Group",
    status: "Lost",
    notes: "Chose an existing vendor for this cycle."
  },
  {
    name: "Nora Kim",
    email: "nora@clearwaterops.com",
    phone: "+1 206 555 0155",
    companyName: "Clearwater Ops",
    status: "Contacted",
    notes: "Needs integration details before next call."
  }
];

async function seed() {
  await connectDatabase();
  await Lead.deleteMany({});
  await Lead.insertMany(sampleLeads);
  await disconnectDatabase();
  console.log(`Seeded ${sampleLeads.length} leads`);
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});

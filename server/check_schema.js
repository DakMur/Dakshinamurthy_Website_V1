import dotenv from 'dotenv';
dotenv.config();

async function checkSchema() {
  const openapiUrl = `${process.env.SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_SERVICE_ROLE}`;
  const specRes = await fetch(openapiUrl);
  const spec = await specRes.json();
  console.log("Members schema:", spec.definitions.members);
}

checkSchema();

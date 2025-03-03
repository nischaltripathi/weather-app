import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

export async function GET() {
  try {
    const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);

    // Fetch API Key
    const secret = await client.getSecret("OPENWEATHER_API_KEY");

    return new Response(JSON.stringify({ apiKey: secret.value }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return new Response(
      JSON.stringify({ message: "Failed to retrieve API key" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

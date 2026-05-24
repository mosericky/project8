import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

// Normalize Kenyan phone numbers to +2547XXXXXXXX format expected by Lipana.
const normalizePhone = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, "");
  if (/^254[17]\d{8}$/.test(digits)) return `+${digits}`;
  if (/^0[17]\d{8}$/.test(digits)) return `+254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `+254${digits}`;
  return null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LIPANA_SECRET_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Lipana secret key not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => null) as { phone?: string; amount?: number; reference?: string } | null;
    if (!body || typeof body.phone !== "string" || typeof body.amount !== "number") {
      return new Response(
        JSON.stringify({ error: "phone (string) and amount (number) are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const phone = normalizePhone(body.phone);
    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Invalid Kenyan phone number." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const amount = Math.max(1, Math.floor(body.amount));

    const lipanaResp = await fetch("https://api.lipana.dev/v1/transactions/push-stk", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        amount,
        reference: body.reference ?? "Ricky·PMM order",
      }),
    });

    const data = await lipanaResp.json().catch(() => ({}));

    if (!lipanaResp.ok) {
      console.error("Lipana STK push failed", lipanaResp.status, data);
      return new Response(
        JSON.stringify({ error: data?.message ?? "STK push failed", details: data }),
        { status: lipanaResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("mpesa-stk-push error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

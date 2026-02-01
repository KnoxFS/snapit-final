// API route to create Filestreams storage account
// Updated to use Filestreams API v2
import { supabase } from "lib/supabase";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { user_id, email } = req.body;

    if (!user_id || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if user already has a Filestreams account
        const { data: existingUser } = await supabase
            .from("users")
            .select("filestreams_account_id")
            .eq("user_id", user_id)
            .single();

        if (existingUser?.filestreams_account_id) {
            return res.status(400).json({ error: "Account already exists" });
        }

        // Get Filestreams API keys from environment
        const apiKey1 = process.env.FILESTREAMS_API_KEY1;
        const apiKey2 = process.env.FILESTREAMS_API_KEY2;
        const defaultPackageId = process.env.FILESTREAMS_DEFAULT_PACKAGE_ID;

        if (!apiKey1 || !apiKey2 || !defaultPackageId) {
            console.error("[Filestreams] Missing environment variables");
            console.error("[Filestreams] Has key1:", !!apiKey1, "Has key2:", !!apiKey2, "Has package_id:", !!defaultPackageId);
            return res.status(500).json({ error: "Server configuration error" });
        }

        // Step 1: Authorize with Filestreams API v2 using API keys
        console.log("[Filestreams] Authorizing with API keys...");
        console.log("[Filestreams] Key1 length:", apiKey1?.length);
        console.log("[Filestreams] Key2 length:", apiKey2?.length);

        const requestBody = `key1=${encodeURIComponent(apiKey1)}&key2=${encodeURIComponent(apiKey2)}`;
        console.log("[Filestreams] Request body length:", requestBody.length);

        const authResponse = await fetch("https://www.filestreams.com/api/v2/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: requestBody,
        });

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            console.error("[Filestreams] Authorization HTTP error:", authResponse.status, errorText);
            return res.status(500).json({ error: `Failed to authorize: ${authResponse.status} ${errorText}` });
        }

        const authData = await authResponse.json();
        console.log("[Filestreams] Auth response:", JSON.stringify(authData));

        if (authData._status !== "success") {
            console.error("[Filestreams] Authorization failed - Full response:", JSON.stringify(authData));
            console.error("[Filestreams] Error message:", authData.response);
            console.error("[Filestreams] Error details:", authData.details || "none");
            return res.status(500).json({ error: authData.response || "Failed to authorize with Filestreams" });
        }

        const { access_token } = authData.data;
        console.log("[Filestreams] Authorization successful");

        // Step 2: Generate unique username and password
        const username = `snapit_${user_id.substring(0, 8)}_${Date.now()}`;
        const password = generateSecurePassword();

        // Step 3: Create account via Filestreams API v2
        console.log("[Filestreams] Creating account for:", email);
        const createResponse = await fetch("https://www.filestreams.com/api/v2/account/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                access_token: access_token,
                username: username,
                password: password,
                email: email,
                package_id: defaultPackageId,
                status: "active",
            }),
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error("[Filestreams] Account creation failed:", errorText);
            return res.status(500).json({ error: "Failed to create Filestreams account" });
        }

        const createData = await createResponse.json();
        console.log("[Filestreams] Create response:", JSON.stringify(createData));

        if (createData._status !== "success") {
            console.error("[Filestreams] Account creation failed - Full response:", JSON.stringify(createData));
            console.error("[Filestreams] Status:", createData._status);
            console.error("[Filestreams] Response:", createData.response);
            console.error("[Filestreams] Data:", createData.data);
            return res.status(500).json({ error: createData.response || "Failed to create Filestreams account" });
        }

        const accountId = createData.data.id;
        console.log("[Filestreams] Account created:", accountId);

        // Step 4: Store account details in Supabase
        const { error: updateError } = await supabase
            .from("users")
            .update({
                filestreams_account_id: accountId,
                filestreams_username: username,
                filestreams_status: "active",
            })
            .eq("user_id", user_id);

        if (updateError) {
            console.error("[Filestreams] Failed to update database:", updateError);
            return res.status(500).json({ error: "Failed to save account details" });
        }

        console.log("[Filestreams] Account setup complete for user:", user_id);

        return res.status(200).json({
            success: true,
            account_id: accountId,
            username: username,
        });
    } catch (error) {
        console.error("[Filestreams] Unexpected error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Helper function to generate secure password
function generateSecurePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

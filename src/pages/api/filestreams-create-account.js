// API route to create Filestreams storage account
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

        // Get Filestreams admin credentials from environment
        const adminUsername = process.env.FILESTREAMS_ADMIN_USERNAME;
        const adminPassword = process.env.FILESTREAMS_ADMIN_PASSWORD;
        const defaultPackageId = process.env.FILESTREAMS_DEFAULT_PACKAGE_ID;

        if (!adminUsername || !adminPassword || !defaultPackageId) {
            console.error("[Filestreams] Missing environment variables");
            return res.status(500).json({ error: "Server configuration error" });
        }

        // Step 1: Authorize with Filestreams admin API
        console.log("[Filestreams] Authorizing with admin API...");
        const authResponse = await fetch("https://filestreams.com/api/admin/authorize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: adminUsername,
                password: adminPassword,
            }),
        });

        if (!authResponse.ok) {
            const errorData = await authResponse.json();
            console.error("[Filestreams] Authorization failed:", errorData);
            return res.status(500).json({ error: "Failed to authorize with Filestreams" });
        }

        const { token } = await authResponse.json();
        console.log("[Filestreams] Authorization successful");

        // Step 2: Generate unique username and password
        const username = `snapit_${user_id.substring(0, 8)}_${Date.now()}`;
        const password = generateSecurePassword();

        // Step 3: Create account via Filestreams API
        console.log("[Filestreams] Creating account for:", email);
        const createResponse = await fetch("https://filestreams.com/api/admin/account/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                package_id: defaultPackageId,
            }),
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json();
            console.error("[Filestreams] Account creation failed:", errorData);
            return res.status(500).json({ error: "Failed to create Filestreams account" });
        }

        const accountData = await createResponse.json();
        console.log("[Filestreams] Account created:", accountData.account_id);

        // Step 4: Store account details in Supabase
        const { error: updateError } = await supabase
            .from("users")
            .update({
                filestreams_account_id: accountData.account_id,
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
            account_id: accountData.account_id,
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

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { username, password } = await req.json();

        // Full Access: Admin credentials
        if (username === 'client' && password === 'secureAccess@2025') {
            const token = btoa(JSON.stringify({
                client_id: 'default',
                username: username,
                accessType: 'full',
                timestamp: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));

            return new Response(JSON.stringify({
                success: true,
                token,
                accessType: 'full',
                username: username,
                message: 'Login successful - Full Access'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } 
        // Assessment Access: Limited credentials
        else if (username === 'assessment' && password === 'secureAccess@2025') {
            const token = btoa(JSON.stringify({
                client_id: 'default',
                username: username,
                accessType: 'assessment',
                timestamp: Date.now(),
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }));

            return new Response(JSON.stringify({
                success: true,
                token,
                accessType: 'assessment',
                username: username,
                message: 'Login successful - Assessment Access'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } 
        else {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid credentials'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Server error during login'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

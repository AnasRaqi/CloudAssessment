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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        const url = new URL(req.url);
        const action = url.searchParams.get('action') || 'list';

        if (req.method === 'POST' && action === 'upload') {
            // Handle template upload
            const requestBody = await req.json();
            const { template_data, title, description, created_by = 'system' } = requestBody;

            if (!template_data || !title) {
                throw new Error('Template data and title are required');
            }

            // Save template to database
            const templateRecord = {
                title,
                description: description || '',
                sections: template_data,
                created_by,
                updated_at: new Date().toISOString()
            };

            const response = await fetch(`${supabaseUrl}/rest/v1/questionnaire_templates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(templateRecord)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save template: ${errorText}`);
            }

            const savedTemplate = await response.json();

            return new Response(JSON.stringify({
                success: true,
                data: savedTemplate[0],
                message: 'Template uploaded successfully'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } else if (req.method === 'GET') {
            if (action === 'list') {
                // Get all templates
                const response = await fetch(`${supabaseUrl}/rest/v1/questionnaire_templates?is_active=eq.true&order=created_at.desc`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch templates');
                }

                const templates = await response.json();

                return new Response(JSON.stringify({
                    success: true,
                    data: templates
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } else if (action === 'get' && url.searchParams.get('id')) {
                // Get specific template
                const templateId = url.searchParams.get('id');

                const response = await fetch(`${supabaseUrl}/rest/v1/questionnaire_templates?id=eq.${templateId}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch template');
                }

                const templates = await response.json();

                if (templates.length === 0) {
                    throw new Error('Template not found');
                }

                return new Response(JSON.stringify({
                    success: true,
                    data: templates[0]
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        } else if (req.method === 'DELETE') {
            if (action === 'delete' && url.searchParams.get('id')) {
                // Soft delete template (set is_active to false)
                const templateId = url.searchParams.get('id');

                const response = await fetch(`${supabaseUrl}/rest/v1/questionnaire_templates?id=eq.${templateId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        is_active: false,
                        updated_at: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to delete template');
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: 'Template deleted successfully'
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // Default action - return templates list
        const response = await fetch(`${supabaseUrl}/rest/v1/questionnaire_templates?is_active=eq.true&order=created_at.desc`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch templates');
        }

        const templates = await response.json();

        return new Response(JSON.stringify({
            success: true,
            data: templates
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Template manager error:', error);

        const errorResponse = {
            error: {
                code: 'TEMPLATE_MANAGER_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

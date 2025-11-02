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

        // Parse request body for POST requests
        let requestBody = {};
        if (req.method === 'POST') {
            requestBody = await req.json();
        }
        const { client_id, sections, submit } = requestBody;

        if (req.method === 'GET') {
            // For GET requests, expect client_id in query parameters or headers
            const url = new URL(req.url);
            const client_id = url.searchParams.get('client_id') || 'naqel'; // default client

            // Get existing questionnaire responses - get most recent first
            const response = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}&order=created_at.desc`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch questionnaire data');
            }

            const assessments = await response.json();
            
            if (assessments.length === 0) {
                // Return empty structure for new client
                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        sections: {},
                        assessment: {}
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const assessment = assessments[0];
            
            return new Response(JSON.stringify({
                success: true,
                data: {
                    sections: assessment.sections || {},
                    assessment: assessment.assessment || {}
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } else if (req.method === 'POST') {
            // Save/update questionnaire responses
            // client_id, sections, submit are already extracted from requestBody above
            
            // If only client_id is provided (no sections), treat as GET operation
            if (!sections && !submit) {
                const response = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}&order=created_at.desc`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch questionnaire data');
                }

                const assessments = await response.json();
                
                if (assessments.length === 0) {
                    // Return empty structure for new client
                    return new Response(JSON.stringify({
                        success: true,
                        data: {
                            sections: {},
                            assessment: {}
                        }
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                const assessment = assessments[0];
                
                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        sections: assessment.sections || {},
                        assessment: assessment.assessment || {}
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Check if assessment exists - get most recent first
            const existingResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}&order=created_at.desc`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });

            const existingAssessments = await existingResponse.json();

            if (existingAssessments.length === 0) {
                // Create new assessment
                const newAssessment = {
                    client_id: client_id,
                    sections: sections || {},
                    assessment: {
                        status: submit ? 'submitted' : 'pending',
                        findings: '',
                        attachments: [],
                        submitted: !!submit,
                        submitted_at: submit ? new Date().toISOString() : null
                    },
                    timestamps: {
                        created: new Date().toISOString(),
                        updated: new Date().toISOString()
                    }
                };

                const createResponse = await fetch(`${supabaseUrl}/rest/v1/assessments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(newAssessment)
                });

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    throw new Error(`Failed to create assessment: ${errorText}`);
                }

                const createdAssessment = await createResponse.json();

                return new Response(JSON.stringify({
                    success: true,
                    data: createdAssessment[0],
                    message: submit ? 'Questionnaire submitted successfully!' : 'Assessment saved successfully'
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } else {
                // Update existing assessment
                const assessment = existingAssessments[0];
                const updatedSections = {
                    ...assessment.sections,
                    ...sections
                };

                const updatedAssessment = {
                    sections: updatedSections,
                    timestamps: {
                        ...assessment.timestamps,
                        updated: new Date().toISOString()
                    }
                };

                if (submit) {
                    updatedAssessment.assessment = {
                        ...assessment.assessment,
                        submitted: true,
                        submitted_at: new Date().toISOString()
                    };
                }

                const updateResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(updatedAssessment)
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Failed to update assessment: ${errorText}`);
                }

                const updated = await updateResponse.json();

                return new Response(JSON.stringify({
                    success: true,
                    data: updated[0],
                    message: submit ? 'Questionnaire submitted successfully!' : 'Assessment saved successfully'
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

    } catch (error) {
        console.error('Questionnaire error:', error);

        const errorResponse = {
            error: {
                code: 'QUESTIONNAIRE_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
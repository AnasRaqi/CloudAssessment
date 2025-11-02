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

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');

        // Decode token to get client_id
        let tokenData;
        try {
            tokenData = JSON.parse(atob(token));
        } catch (e) {
            throw new Error('Invalid token format');
        }

        const client_id = tokenData.client_id;

        if (req.method === 'GET') {
            // Get assessment data
            const response = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assessment data');
            }

            const assessments = await response.json();
            
            if (assessments.length === 0) {
                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        status: 'pending',
                        findings: '',
                        attachments: [],
                        canAccess: false
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const assessment = assessments[0];
            const isQuestionnaireSubmitted = assessment.assessment?.submitted || false;
            
            return new Response(JSON.stringify({
                success: true,
                data: {
                    status: assessment.assessment?.status || 'pending',
                    findings: assessment.assessment?.findings || '',
                    attachments: assessment.assessment?.attachments || [],
                    canAccess: isQuestionnaireSubmitted,
                    submitted: isQuestionnaireSubmitted
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } else if (req.method === 'POST') {
            // Update assessment (AlphaCloud phase)
            const { status, findings, attachments, complete } = await req.json();

            // First check if questionnaire is submitted
            const response = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });

            const assessments = await response.json();
            
            if (assessments.length === 0) {
                throw new Error('Assessment not found');
            }

            const assessment = assessments[0];
            const isQuestionnaireSubmitted = assessment.assessment?.submitted || false;

            if (!isQuestionnaireSubmitted) {
                throw new Error('Questionnaire must be submitted before accessing assessment');
            }

            const updatedAssessment = {
                assessment: {
                    ...assessment.assessment,
                    status: status || assessment.assessment?.status || 'in_progress',
                    findings: findings !== undefined ? findings : assessment.assessment?.findings || '',
                    attachments: attachments !== undefined ? attachments : assessment.assessment?.attachments || [],
                    updated_at: new Date().toISOString()
                }
            };

            if (complete) {
                updatedAssessment.assessment.status = 'completed';
                updatedAssessment.assessment.completed_at = new Date().toISOString();
            }

            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAssessment)
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Failed to update assessment: ${errorText}`);
            }

            return new Response(JSON.stringify({
                success: true,
                message: 'Assessment updated successfully'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Assessment error:', error);

        const errorResponse = {
            error: {
                code: 'ASSESSMENT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
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

        if (req.method === 'DELETE') {
            // Handle DELETE requests for deleting assessments
            const url = new URL(req.url);
            const assessment_id = url.searchParams.get('assessment_id');
            
            if (!assessment_id) {
                throw new Error('Assessment ID is required for delete operation');
            }

            // Delete the assessment from database
            const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?id=eq.${assessment_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text();
                throw new Error(`Failed to delete assessment: ${errorText}`);
            }

            return new Response(JSON.stringify({
                success: true,
                message: 'Assessment deleted successfully'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } else if (req.method === 'GET' || req.method === 'POST') {
            // For POST requests, check if it has an action parameter
            let requestBody = {};
            let client_id = 'naqel';
            let action = null;
            
            if (req.method === 'POST') {
                requestBody = await req.json();
                client_id = requestBody.client_id || 'naqel';
                action = requestBody.action;
            } else {
                // For GET requests, try to get client_id from query parameters
                const url = new URL(req.url);
                client_id = url.searchParams.get('client_id') || 'naqel';
            }

            // If it's a POST with action=delete, handle delete assessment
            if (action === 'delete') {
                const assessment_id = requestBody.assessment_id;
                
                if (!assessment_id) {
                    throw new Error('Assessment ID is required for delete operation');
                }

                // Delete the assessment from database
                const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?id=eq.${assessment_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!deleteResponse.ok) {
                    const errorText = await deleteResponse.text();
                    throw new Error(`Failed to delete assessment: ${errorText}`);
                }

                return new Response(JSON.stringify({
                    success: true,
                    message: 'Assessment deleted successfully'
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            // If it's a POST with action=create_new, handle create new assessment
            else if (action === 'create_new') {
                // Check if assessment already exists
                const existingResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                const existingAssessments = await existingResponse.json();

                if (existingAssessments.length > 0) {
                    // Archive existing assessment (mark as archived)
                    const assessment = existingAssessments[0];
                    const assessmentId = assessment.id;
                    
                    await fetch(`${supabaseUrl}/rest/v1/assessments?id=eq.${assessmentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            assessment: {
                                ...assessment.assessment,
                                status: 'archived'
                            },
                            timestamps: {
                                ...assessment.timestamps,
                                archived: new Date().toISOString()
                            }
                        })
                    });
                }

                // Create new assessment
                const newAssessment = {
                    client_id: client_id,
                    sections: {},
                    assessment: {
                        status: 'pending',
                        findings: '',
                        attachments: [],
                        submitted: false,
                        submitted_at: null
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
                    throw new Error(`Failed to create new assessment: ${errorText}`);
                }

                const createdAssessment = await createResponse.json();

                return new Response(JSON.stringify({
                    success: true,
                    data: createdAssessment[0],
                    message: 'New assessment created successfully'
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            // Handle GET or POST without action = get submitted assessments
            else {
                // Handle GET or POST without action = get submitted assessments
                // Get assessments for specific client_id, then filter for submitted ones in JavaScript
                const response = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}&order=timestamps->>created.desc`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch assessments: ${errorText}`);
                }

                const allAssessments = await response.json();
                
                // Filter submitted assessments
                const submittedAssessments = await Promise.all(
                    allAssessments
                        .filter((assessment: any) => assessment.assessment?.submitted === true)
                        .map(async (assessment: any) => {
                            // Get uploaded files for this assessment
                            const filesResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files?assessment_id=eq.${assessment.id}`, {
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey,
                                    'Content-Type': 'application/json'
                                }
                            });

                            const uploadedFiles = filesResponse.ok ? await filesResponse.json() : [];
                            
                            // Group files by section and add download URLs
                            const filesWithUrls = await Promise.all(uploadedFiles.map(async (file: any) => {
                                // Generate public URL for download (since bucket is public)
                                let downloadUrl = null;
                                try {
                                    // Since the bucket is public, we can generate a direct public URL
                                    downloadUrl = `${supabaseUrl}/storage/v1/object/public/assessment-uploads/${file.storage_path}`;
                                } catch (error) {
                                    console.log(`Failed to generate download URL for file ${file.id}:`, error);
                                }
                                
                                return {
                                    id: file.id,
                                    filename: file.original_filename || file.filename,
                                    fileSize: file.file_size,
                                    mimeType: file.mime_type,
                                    storagePath: file.storage_path,
                                    uploadedAt: file.created_at,
                                    downloadUrl: downloadUrl
                                };
                            }));
                            
                            const attachments = filesWithUrls.reduce((acc: any, file: any) => {
                                if (!acc[file.section]) {
                                    acc[file.section] = [];
                                }
                                acc[file.section].push(file);
                                return acc;
                            }, {});

                            return {
                                id: assessment.id,
                                client_id: assessment.client_id,
                                submitted_at: assessment.assessment?.submitted_at,
                                sections: assessment.sections || {},
                                assessment: assessment.assessment || {},
                                attachments: attachments,
                                created_at: assessment.timestamps?.created,
                                updated_at: assessment.timestamps?.updated
                            };
                        })
                );

                return new Response(JSON.stringify({
                    success: true,
                    data: submittedAssessments
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        } else {
            // Method not allowed
            return new Response(JSON.stringify({
                success: false,
                message: 'Method not allowed'
            }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

    } catch (error) {
        console.error('Submitted assessments error:', error);

        const errorResponse = {
            error: {
                code: 'SUBMITTED_ASSESSMENTS_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
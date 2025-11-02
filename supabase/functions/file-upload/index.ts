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

        // Get client authentication and file data from request body
        const requestBody = await req.json();
        const { client_id, fileData, fileName, section } = requestBody;

        if (!fileData || !fileName) {
            throw new Error('File data and filename are required');
        }

        // Extract base64 data from data URL
        const base64Data = fileData.split(',')[1];
        const mimeType = fileData.split(';')[0].split(':')[1];

        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Generate storage path
        const timestamp = Date.now();
        const storagePath = `${client_id}/${section}/${timestamp}-${fileName}`;

        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/assessment-uploads/${storagePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/assessment-uploads/${storagePath}`;

        // Find or create assessment record
        const assessmentResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        const assessments = await assessmentResponse.json();

        if (assessments.length > 0) {
            // Update existing assessment with file reference
            const assessment = assessments[0];
            const updatedSections = {
                ...assessment.sections,
                [section]: {
                    ...assessment.sections[section],
                    uploads: [
                        ...(assessment.sections[section]?.uploads || []),
                        {
                            filename: fileName,
                            storage_path: storagePath,
                            public_url: publicUrl,
                            uploaded_at: new Date().toISOString(),
                            file_size: binaryData.length,
                            mime_type: mimeType
                        }
                    ]
                }
            };

            await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sections: updatedSections,
                    timestamps: {
                        ...assessment.timestamps,
                        updated: new Date().toISOString()
                    }
                })
            });
        }

        // Record file upload in uploaded_files table
        const fileRecord = {
            assessment_id: assessments.length > 0 ? assessments[0].id : null,
            section: section,
            filename: fileName,
            original_filename: fileName,
            file_size: binaryData.length,
            mime_type: mimeType,
            storage_path: storagePath,
            uploaded_by: client_id
        };

        await fetch(`${supabaseUrl}/rest/v1/uploaded_files`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileRecord)
        });

        return new Response(JSON.stringify({
            success: true,
            data: {
                publicUrl,
                storagePath,
                fileName,
                fileSize: binaryData.length,
                mimeType
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('File upload error:', error);

        const errorResponse = {
            error: {
                code: 'FILE_UPLOAD_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
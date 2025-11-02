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
        const { assessmentData, client_id } = await req.json();

        if (!assessmentData) {
            throw new Error('Assessment data is required');
        }

        const { sections, assessment, submittedAt } = assessmentData;

        // Get uploaded files/attachments from the database
        let attachments = {};
        try {
            const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
            const supabaseUrl = Deno.env.get('SUPABASE_URL');

            if (serviceRoleKey && supabaseUrl) {
                // Find the assessment ID first
                const assessmentsResponse = await fetch(`${supabaseUrl}/rest/v1/assessments?client_id=eq.${client_id}&order=timestamps->>created.desc&limit=1`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    }
                });

                if (assessmentsResponse.ok) {
                    const assessments = await assessmentsResponse.json();
                    if (assessments.length > 0) {
                        const assessmentId = assessments[0].id;
                        
                        // Get uploaded files for this assessment
                        const filesResponse = await fetch(`${supabaseUrl}/rest/v1/uploaded_files?assessment_id=eq.${assessmentId}`, {
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (filesResponse.ok) {
                            const uploadedFiles = await filesResponse.json();
                            
                            // Group files by section
                            attachments = uploadedFiles.reduce((acc: any, file: any) => {
                                if (!acc[file.section]) {
                                    acc[file.section] = [];
                                }
                                // Generate public download URL
                                const downloadUrl = `${supabaseUrl}/storage/v1/object/public/assessment-uploads/${file.storage_path}`;
                                acc[file.section].push({
                                    filename: file.original_filename || file.filename,
                                    fileSize: file.file_size,
                                    mimeType: file.mime_type,
                                    downloadUrl: downloadUrl
                                });
                                return acc;
                            }, {});
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Failed to fetch attachments for PDF:', error);
        }

        // Create HTML content for the assessment
        const htmlContent = generateAssessmentHTML(sections, assessment, submittedAt, attachments);

        return new Response(htmlContent, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Disposition': 'attachment; filename="assessment-report.html"'
            }
        });

    } catch (error) {
        console.error('PDF export error:', error);

        const errorResponse = {
            error: {
                code: 'PDF_EXPORT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

function generateAssessmentHTML(sections: any, assessment: any, submittedAt: string, attachments: any = {}): string {
    const sectionTitles: Record<string, string> = {
        'A': 'Company Information',
        'B': 'Billing & Cost Management',
        'C': 'Compute Resources',
        'D': 'Storage Solutions',
        'E': 'Networking',
        'F': 'Database Services',
        'G': 'Security & Compliance',
        'H': 'Future Plans',
        'I': 'Business Alignment',
        'J': 'Additional Information'
    };

    const submittedDate = new Date(submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AlphaCloud Assessment Report</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
            }
            .header {
                background: linear-gradient(135deg, #2F3134 0%, #3B3F42 100%);
                color: white;
                padding: 30px;
                margin: -20px -20px 30px -20px;
                border-radius: 0 0 10px 10px;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                margin: 10px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
            }
            .meta-info {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .meta-info h3 {
                margin-top: 0;
                color: #2F3134;
            }
            .section {
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .section h3 {
                background: #2F3134;
                color: white;
                margin: -20px -20px 20px -20px;
                padding: 15px 20px;
                border-radius: 8px 8px 0 0;
                font-size: 18px;
                font-weight: bold;
            }
            .field {
                margin: 15px 0;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 4px solid #50D8FF;
            }
            .field-label {
                font-weight: bold;
                color: #2F3134;
                margin-bottom: 5px;
            }
            .field-value {
                color: #555;
                white-space: pre-wrap;
            }
            .findings {
                background: #e3f2fd;
                border: 1px solid #90caf9;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .findings h3 {
                color: #1976d2;
                margin-top: 0;
            }
            .footer {
                margin-top: 50px;
                padding: 20px;
                background: #f8f9fa;
                text-align: center;
                border-radius: 8px;
                font-size: 14px;
                color: #666;
            }
            @media print {
                body { margin: 0; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>ALPHACLOUD</h1>
            <p>GCP Assessment Report</p>
        </div>

        <div class="meta-info">
            <h3>Assessment Summary</h3>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Submitted:</strong> ${submittedDate}</p>
            <p><strong>Client:</strong> Naqel</p>
        </div>
    `;

    // Add sections
    if (sections && typeof sections === 'object') {
        Object.entries(sections).forEach(([sectionKey, sectionData]) => {
            if (sectionData && typeof sectionData === 'object') {
                html += `
                <div class="section">
                    <h3>Section ${sectionKey}: ${sectionTitles[sectionKey] || 'Unknown Section'}</h3>
                `;

                if (sectionData.fields && typeof sectionData.fields === 'object') {
                    Object.entries(sectionData.fields).forEach(([fieldName, fieldValue]) => {
                        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
                            html += `
                            <div class="field">
                                <div class="field-label">${fieldName.replace(/_/g, ' ').toUpperCase()}:</div>
                                <div class="field-value">${formatFieldValue(fieldValue)}</div>
                            </div>
                            `;
                        }
                    });
                }

                // Add attachments for this section
                if (attachments[sectionKey] && Array.isArray(attachments[sectionKey]) && attachments[sectionKey].length > 0) {
                    html += `
                    <div class="field">
                        <div class="field-label">UPLOADED DOCUMENTS:</div>
                        <div class="field-value">
                    `;
                    attachments[sectionKey].forEach((file: any) => {
                        const filename = file.filename;
                        const downloadUrl = file.downloadUrl;
                        const fileSize = file.fileSize ? ` (${(file.fileSize / 1024).toFixed(1)} KB)` : '';
                        if (downloadUrl) {
                            html += `• <a href="${downloadUrl}" target="_blank" style="color: #1976d2; text-decoration: none;">${filename}</a>${fileSize}<br>`;
                        } else {
                            html += `• ${filename}${fileSize}<br>`;
                        }
                    });
                    html += `
                        </div>
                    </div>
                    `;
                }

                html += `</div>`;
            }
        });
    }

    // Add all attachments overview
    const allAttachmentSections = Object.keys(attachments);
    if (allAttachmentSections.length > 0) {
        html += `
        <div class="section">
            <h3>All Attachments</h3>
        `;
        
        allAttachmentSections.forEach(sectionKey => {
            if (attachments[sectionKey] && attachments[sectionKey].length > 0) {
                html += `
                <div class="field">
                    <div class="field-label">SECTION ${sectionKey} DOCUMENTS:</div>
                    <div class="field-value">
                `;
                attachments[sectionKey].forEach((file: any) => {
                    const filename = file.filename;
                    const downloadUrl = file.downloadUrl;
                    const fileSize = file.fileSize ? ` (${(file.fileSize / 1024).toFixed(1)} KB)` : '';
                    if (downloadUrl) {
                        html += `• <a href="${downloadUrl}" target="_blank" style="color: #1976d2; text-decoration: none;">${filename}</a>${fileSize}<br>`;
                    } else {
                        html += `• ${filename}${fileSize}<br>`;
                    }
                });
                html += `
                    </div>
                </div>
                `;
            }
        });
        
        html += `</div>`;
    }

    // Add assessment findings
    if (assessment && assessment.findings) {
        html += `
        <div class="findings">
            <h3>Assessment Findings</h3>
            <p>${assessment.findings}</p>
        </div>
        `;
    }

    html += `
        <div class="footer">
            <p>© 2025 AlphaCloud | Confidential - For Naqel Use Only</p>
            <p>This report contains proprietary and confidential information.</p>
        </div>
    </body>
    </html>
    `;

    return html;
}

function formatFieldValue(value: any): string {
    if (Array.isArray(value)) {
        return value.join(', ');
    } else if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    } else {
        return String(value);
    }
}

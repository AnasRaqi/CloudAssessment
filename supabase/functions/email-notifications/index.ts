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
        const { type, client_id = 'naqel', assessment_data } = await req.json();

        if (!type) {
            throw new Error('Notification type is required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let emailData = {};

        switch (type) {
            case 'questionnaire_submitted':
                emailData = {
                    to: Deno.env.get('ALPHACLOUD_EMAIL') || 'assessment@alphacloud.com',
                    subject: 'GCP Assessment Questionnaire Submitted - Naqel',
                    body: `A new GCP assessment questionnaire has been submitted by Naqel.

Assessment Details:
- Client: Naqel
- Submission Date: ${new Date().toLocaleDateString()}
- Status: Ready for Assessment Review

Please log in to the AlphaCloud Assessment Portal to review and provide your assessment.`
                };
                break;

            case 'assessment_uploaded':
                emailData = {
                    to: Deno.env.get('NAQEL_EMAIL') || 'contact@naqel.com',
                    subject: 'GCP Assessment Completed - AlphaCloud',
                    body: `Your GCP assessment has been completed by AlphaCloud.

Assessment Details:
- Client: Naqel
- Completion Date: ${new Date().toLocaleDateString()}
- Status: Assessment Available

Please log in to the AlphaCloud Assessment Portal to review your assessment findings and recommendations.`
                };
                break;

            case 'assessment_completed':
                emailData = {
                    to: `${Deno.env.get('ALPHACLOUD_EMAIL') || 'assessment@alphacloud.com'},${Deno.env.get('NAQEL_EMAIL') || 'contact@naqel.com'}`,
                    subject: 'GCP Assessment Fully Completed - AlphaCloud & Naqel',
                    body: `The GCP assessment process has been fully completed.

Assessment Details:
- Client: Naqel
- Completion Date: ${new Date().toLocaleDateString()}
- Final Status: Completed

Both parties have been notified. All documentation and recommendations are now available in the portal.`
                };
                break;

            default:
                throw new Error('Unknown notification type');
        }

        // In a real implementation, you would use a proper email service
        // For demo purposes, we'll just log the email and return success
        console.log('Email notification would be sent:', emailData);

        // Record email notification in database
        const notificationRecord = {
            assessment_id: assessment_data?.id || null,
            notification_type: type,
            recipient_email: emailData.to,
            status: 'sent',
            sent_at: new Date().toISOString()
        };

        await fetch(`${supabaseUrl}/rest/v1/email_notifications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationRecord)
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Email notification processed successfully',
            emailData: emailData
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Email notification error:', error);

        const errorResponse = {
            error: {
                code: 'EMAIL_NOTIFICATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
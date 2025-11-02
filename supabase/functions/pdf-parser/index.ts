Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        if (req.method !== 'POST') {
            throw new Error('Only POST method allowed');
        }

        const requestBody = await req.json();
        const { pdf_content } = requestBody;

        if (!pdf_content) {
            throw new Error('PDF content is required');
        }

        // Simple text-based parsing (in a real implementation, you'd use a proper PDF parser)
        // For now, we'll parse text that follows our template format
        
        const lines = pdf_content.split('\n');
        const template = {
            title: '',
            description: '',
            sections: []
        };

        let currentSection = null;
        let currentQuestion = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Parse template metadata
            if (line.startsWith('Questionnaire Title:')) {
                template.title = line.replace('Questionnaire Title:', '').trim();
            } else if (line.startsWith('Description:')) {
                template.description = line.replace('Description:', '').trim();
            }
            // Parse section headers
            else if (line.startsWith('SECTION:')) {
                // Save previous section if exists
                if (currentSection && currentQuestion) {
                    currentSection.fields.push(currentQuestion);
                }
                if (currentSection) {
                    template.sections.push(currentSection);
                }
                
                // Start new section
                const sectionId = line.replace('SECTION:', '').trim();
                currentSection = {
                    id: sectionId,
                    title: '',
                    description: '',
                    fields: []
                };
                currentQuestion = null;
            }
            // Parse section metadata
            else if (line.startsWith('TITLE:') && currentSection) {
                currentSection.title = line.replace('TITLE:', '').trim();
            }
            else if (line.startsWith('DESCRIPTION:') && currentSection) {
                currentSection.description = line.replace('DESCRIPTION:', '').trim();
            }
            // Parse questions
            else if (line.startsWith('QUESTION:')) {
                // Save previous question if exists
                if (currentQuestion && currentSection) {
                    currentSection.fields.push(currentQuestion);
                }
                
                // Start new question
                currentQuestion = {
                    name: '',
                    label: '',
                    type: 'text',
                    required: false,
                    options: []
                };
                currentQuestion.label = line.replace('QUESTION:', '').trim();
            }
            else if (line.startsWith('FIELD_NAME:') && currentQuestion) {
                currentQuestion.name = line.replace('FIELD_NAME:', '').trim();
            }
            else if (line.startsWith('FIELD_TYPE:') && currentQuestion) {
                currentQuestion.type = line.replace('FIELD_TYPE:', '').trim().toLowerCase();
            }
            else if (line.startsWith('REQUIRED:') && currentQuestion) {
                currentQuestion.required = line.replace('REQUIRED:', '').trim().toLowerCase() === 'true';
            }
            else if (line.startsWith('HINT:') && currentQuestion) {
                currentQuestion.hint = line.replace('HINT:', '').trim();
            }
            else if (line.startsWith('OPTIONS:') && currentQuestion) {
                const optionsStr = line.replace('OPTIONS:', '').trim();
                currentQuestion.options = optionsStr.split('|').map(opt => opt.trim());
            }
        }
        
        // Save final question and section
        if (currentQuestion && currentSection) {
            currentSection.fields.push(currentQuestion);
        }
        if (currentSection) {
            template.sections.push(currentSection);
        }
        
        // Validate template
        if (!template.title) {
            throw new Error('Template title is required');
        }
        if (template.sections.length === 0) {
            throw new Error('At least one section is required');
        }
        
        // Validate questions have required fields
        for (const section of template.sections) {
            if (!section.title) {
                throw new Error(`Section ${section.id} must have a title`);
            }
            if (section.fields.length === 0) {
                throw new Error(`Section ${section.id} must have at least one question`);
            }
            for (const field of section.fields) {
                if (!field.name) {
                    throw new Error(`Question in section ${section.id} must have a field name`);
                }
                if (!field.label) {
                    throw new Error(`Question in section ${section.id} must have a label`);
                }
            }
        }
        
        return new Response(JSON.stringify({
            success: true,
            data: template,
            message: 'PDF parsed successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('PDF parser error:', error);

        const errorResponse = {
            error: {
                code: 'PDF_PARSER_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

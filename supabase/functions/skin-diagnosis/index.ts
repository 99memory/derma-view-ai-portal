import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, symptoms } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: '请提供图片' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API密钥未配置' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `你是一位专业的皮肤科辅助诊断助手。请根据用户上传的皮肤图片和症状描述，提供客观、专业的初步诊断意见。

常见皮肤病变类型包括但不限于：
- MEL (Melanoma/黑色素瘤): 恶性，通常不对称、边界不规则、颜色不均匀、直径>6mm
- NV (Melanocytic Nevi/色素痣): 良性，通常对称、边界清晰、颜色均匀
- BCC (Basal Cell Carcinoma/基底细胞癌): 恶性，珍珠样光泽、毛细血管扩张、中央可能溃疡
- AKIEC (Actinic Keratoses/光化性角化病): 癌前病变，粗糙鳞屑、日光暴露部位
- BKL (Benign Keratosis/良性角化病): 良性，包括脂溢性角化病、日光性雀斑样痣
- DF (Dermatofibroma/皮肤纤维瘤): 良性，坚实结节、褐色、挤压时中央凹陷
- VASC (Vascular Lesions/血管病变): 包括血管瘤、血管角化瘤等
- SCC (Squamous Cell Carcinoma/鳞状细胞癌): 恶性，结节或溃疡、角化过度

请严格按照以下JSON格式返回分析结果（不要包含其他文字）：
{
  "diagnosis": "诊断名称（使用中文名称，如：良性色素痣、基底细胞癌、光化性角化病、脂溢性角化病等）",
  "confidence": 数字（0-100的置信度百分比，根据图像清晰度和特征明显程度调整）,
  "riskLevel": "低风险/中风险/高风险",
  "details": ["分析要点1", "分析要点2", "分析要点3", "分析要点4"],
  "recommendations": ["建议1", "建议2", "建议3", "建议4"]
}

分析时请综合考虑：
1. ABCDE原则：不对称性(Asymmetry)、边界(Border)、颜色(Color)、直径(Diameter)、演变(Evolution)
2. 病变的形态特征：表面纹理、光泽、鳞屑、溃疡等
3. 用户提供的症状描述：包括病程、变化情况、伴随症状（瘙痒、疼痛、出血等）
4. 患者的风险因素：如提及日晒史、年龄等
5. 根据实际图像特征做出判断，不要偏向任何特定诊断

风险等级判定：
- 高风险：疑似恶性肿瘤（黑色素瘤、基底细胞癌、鳞状细胞癌）
- 中风险：癌前病变或需要进一步检查的病变
- 低风险：明确的良性病变

重要提醒：这只是辅助诊断，最终诊断需要专业医生确认。请根据图像实际特征客观分析，避免过度诊断。`;

    const userMessage = symptoms 
      ? `请分析这张皮肤图片。患者描述的症状：${symptoms}`
      : '请分析这张皮肤图片，提供初步诊断意见。';

    // Clean base64 string - remove data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userMessage },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: '智能分析服务暂时不可用，请稍后重试' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('No response from Gemini');
      return new Response(
        JSON.stringify({ error: '未能获取分析结果' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from Gemini
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      } else {
        // Try to find JSON object directly
        const jsonObjectMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          jsonStr = jsonObjectMatch[0];
        }
      }
      
      const result = JSON.parse(jsonStr);
      
      return new Response(
        JSON.stringify({
          diagnosis: result.diagnosis || '未知',
          confidence: result.confidence || 75,
          riskLevel: result.riskLevel || '中风险',
          details: result.details || ['分析完成'],
          recommendations: result.recommendations || ['建议咨询专业医生'],
          needsDoctorReview: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError, aiResponse);
      // Return a fallback response if parsing fails
      return new Response(
        JSON.stringify({
          diagnosis: '需要专业医生评估',
          confidence: 70,
          riskLevel: '中风险',
          details: ['智能分析已完成，但结果需要医生确认', aiResponse.substring(0, 200)],
          recommendations: ['建议尽快咨询专业皮肤科医生', '保持病变部位清洁', '避免抓挠或刺激病变区域'],
          needsDoctorReview: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in skin-diagnosis function:', error);
    return new Response(
      JSON.stringify({ error: error.message || '分析过程中发生错误' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

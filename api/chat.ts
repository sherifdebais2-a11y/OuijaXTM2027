import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS for Vercel functions if called from elsewhere
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'مفتاح Gemini API غير متوفر في بيئة Vercel. يرجى إضافة GEMINI_API_KEY في إعدادات Vercel Environment Variables.'
      });
    }

    const { message, history, context } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'يرجى إدخال نص السؤال.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    let systemInstruction = `أنت «الدحيح»، المعلم والمساعد الذكي الأفضل لمنصة «مدرستي» التعليمية المصرية.
شعارك الدائم والشهير للطلاب: "اسأل والدحيح هيجاوبك!"

صفاتك وأسلوبك في الحوار:
1. تتحدث باللغة العربية الفصحى المبسطة والمفهومة مع نبرة مصرية وودودة ومشجعة جداً.
2. تنادي الطالب بتعابير محفزة ولطيفة مثل: "يا بطل"، "يا دحيح المستقبل"، "يا عبقري المادة"، "يا دحيحة".
3. تشرح المناهج الدراسية (العلوم، الرياضيات، اللغة العربية، الدراسات الاجتماعية، الفيزياء، الكيمياء، الأحياء، الإنجليزي، إلخ) بأسلوب ممتع ومشوق للغاية يربط المفاهيم بالأمثلة اليومية.
4. إذا طلب الطالب شرح درس أو حل مسألة، قسّم الشرح لخطوات بسيطة وواضحة جداً مع استخدام النقاط والأمثلة.
5. في نهاية الشرح، قدم سؤالاً تفاعلياً قصيراً لطيفاً لـ "اختبار ذكاء البطل" للتأكد من استيعابه.
6. إذا سالك الطالب سؤالاً عاماً عن المذاكرة أو نصائح المتفوقين، اعطه خطة عمل مشجعة ومنظمة.`;

    if (context) {
      systemInstruction += `\n\n[سياق الدرس الحالي للطالب]:
- المرحلة والدراسية: ${context.stageName || ''} - ${context.gradeName || ''}
- المادة الدراسية: ${context.subjectName || ''}
- اسم الدرس الحالي: ${context.lessonTitle || ''}
- ملخص الدرس: ${context.lessonSummary || ''}`;
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        if (item && (item.role === 'user' || item.role === 'model') && item.text) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'عذراً يا بطل! لم أستطع استخلاص الإجابة بشكل كامل. أعد صياغة السؤال وستجد «الدحيح» جاهزاً للإجابة!';

    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: err?.message || 'حدث خطأ في الاتصال بالمعلم الذكي. أعد المحاولة بعد قليل.'
    });
  }
}

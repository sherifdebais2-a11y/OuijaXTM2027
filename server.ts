import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Chat endpoint for "الدحيح"
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'مفتاح Gemini API غير متوفر في النظام. يرجى التأكد من إعداده في قائمة الحساب والرموز.'
        });
      }

      const { message, history, context } = req.body;

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
3. تشرح المناهج الدراسية (العلوم، الرياضيات، اللغة العربية، الدراسات الاجتماعية، الفيزياء، الكيمياء، الأحياء، الأحياء، الإنجليزي، إلخ) بأسلوب ممتع ومشوق للغاية يربط المفاهيم بالأمثلة اليومية.
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

      // Format conversation contents for Gemini
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

      // Add current user prompt
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


import { TarotReading } from '../types';

/**
 * Converts a remote image URL to a Base64 string using Canvas.
 * This approach is generally more compatible with mobile browsers for CORS-enabled images.
 */
async function imageToBase64(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(url);
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        // Use jpeg with 0.8 quality to keep file size reasonable
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      } catch (e) {
        console.error("Canvas toDataURL failed", e);
        resolve(url);
      }
    };
    img.onerror = function() {
      console.error("Image load failed for base64 conversion", url);
      resolve(url);
    };
    // Add a cache-busting query param to avoid cached images without CORS headers
    img.src = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
  });
}

export const exportReadingToJSON = (data: TarotReading | TarotReading[], filename?: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `Arcanum_Export_${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportReadingToHTML = async (reading: TarotReading) => {
  const isZh = reading.language === 'zh';
  
  // Convert all card images to Base64 for offline availability
  const cardImagesB64 = await Promise.all(
    reading.cards.map(rc => imageToBase64(rc.card.image))
  );

  const cardsHtml = reading.cards.map((rc, idx) => `
    <div class="card-item">
      <div class="card-image-box ${rc.isReversed ? 'reversed' : ''}">
        <img src="${cardImagesB64[idx]}" alt="${rc.card.nameEn}" referrerpolicy="no-referrer">
      </div>
      <div class="card-meta">
        <div class="card-name">${isZh ? rc.card.nameZh : rc.card.nameEn} ${rc.isReversed ? (isZh ? '(逆位)' : '(Rev)') : '(正位)'}</div>
        <div class="card-suite">${rc.card.suite}</div>
      </div>
    </div>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="${reading.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arcanum Record - ${reading.query.substring(0, 30)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root { --amber: #d97706; --stone-900: #1c1917; --stone-950: #0c0a09; }
        body { font-family: 'Inter', sans-serif; background: var(--stone-950); color: #e7e5e4; margin: 0; padding: 60px 20px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; }
        .no-print-zone { margin-bottom: 50px; text-align: center; }
        .btn-print { background: var(--amber); color: white; border: none; padding: 14px 40px; border-radius: 50px; font-weight: bold; cursor: pointer; font-family: 'Cinzel', serif; letter-spacing: 2px; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .btn-print:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(217,119,6,0.2); }
        header { text-align: center; border-bottom: 1px solid #292524; padding-bottom: 40px; margin-bottom: 60px; }
        .brand { font-family: 'Cinzel', serif; color: var(--amber); font-size: 1.4rem; letter-spacing: 6px; margin-bottom: 15px; }
        .query-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-style: italic; margin: 25px 0; color: #f5f5f4; line-height: 1.2; }
        .timestamp { font-size: 0.9rem; color: #78716c; text-transform: uppercase; letter-spacing: 3px; }
        .section-hdr { font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 3px; color: #a8a29e; border-bottom: 1px solid #292524; padding-bottom: 15px; margin: 70px 0 40px; text-transform: uppercase; display: flex; align-items: center; gap: 20px; }
        .section-hdr::after { content: ""; flex-grow: 1; height: 1px; background: #292524; }
        .spread-grid { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; }
        .card-item { width: 180px; text-align: center; }
        .card-image-box { border: 1px solid #292524; border-radius: 12px; overflow: hidden; background: #000; height: 300px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .card-image-box.reversed { transform: rotate(180deg); }
        .card-image-box img { width: 100%; height: 100%; object-fit: contain; }
        .card-name { font-family: 'Playfair Display', serif; margin-top: 20px; font-weight: bold; color: var(--amber); font-size: 1.1rem; }
        .card-suite { font-size: 0.75rem; text-transform: uppercase; color: #57534e; letter-spacing: 1px; margin-top: 4px; }
        .content-box { font-size: 1.1rem; color: #d6d3d1; white-space: pre-wrap; padding: 0 20px; }
        .content-box h2, .content-box h3 { font-family: 'Cinzel', serif; color: var(--amber); font-size: 1.2rem; margin: 50px 0 25px; border-left: 3px solid var(--amber); padding-left: 20px; }
        .user-thought { border-left: 2px solid #444; padding-left: 30px; font-style: italic; color: #a8a29e; margin: 40px 0; }
        footer { margin-top: 120px; text-align: center; font-size: 0.75rem; color: #444; letter-spacing: 5px; border-top: 1px solid #1c1917; padding-top: 30px; text-transform: uppercase; }
        @media print { .no-print-zone { display: none !important; } body { padding: 0; color: #000; background: #fff; } .card-image-box { border-color: #ddd; box-shadow: none; } .query-title, .card-name { color: #000; } header, .section-hdr { border-color: #eee; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="no-print-zone">
            <button class="btn-print" onclick="window.print()">${isZh ? '列印此報告' : 'Print This Report'}</button>
        </div>

        <header>
            <div class="brand">ARCANUM INSIGHT</div>
            <div class="timestamp">${new Date(reading.timestamp).toLocaleString()}</div>
            <div class="query-title">"${reading.query}"</div>
        </header>

        <div class="section-hdr">${isZh ? '抽牌陣容' : 'The Spread'}</div>
        <div class="spread-grid">
            ${cardsHtml}
        </div>

        <div class="section-hdr">${isZh ? 'AI 深度解析' : 'AI Interpretation'}</div>
        <div class="content-box">
            ${reading.analysis?.replace(/# (.*?)\n/g, '<h3>$1</h3>') || 'The oracle remains silent.'}
        </div>

        ${reading.userAnalysis ? `
          <div class="section-hdr">${isZh ? '個人直覺紀錄' : 'Personal Intuition'}</div>
          <div class="content-box user-thought">${reading.userAnalysis}</div>
        ` : ''}

        <footer>
            THE ETERNAL CHRONICLE • GENERATED BY ARCANUM INSIGHT
        </footer>
    </div>

    <!-- RAW DATA EMBEDDED FOR IMPORT -->
    <script id="tarot-raw-data" type="application/json">
        ${JSON.stringify(reading)}
    </script>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Arcanum_Reading_${reading.id.substring(0, 8)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

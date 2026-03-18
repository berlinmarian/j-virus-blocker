# Tweet Face Filter (Chrome Extension)

Bu proje, X/Twitter anasayfasındaki tweet görsellerinde hedef kişinin yüzünü tespit edip tweet'i gizleyen bir Chrome Extension'dır.

## Özellikler

- Manifest V3
- TypeScript + Vite
- `face-api.js` + `@tensorflow/tfjs` ile yüz embedding tabanlı eşleşme
- Options sayfasından fotoğraf yükleyerek profil/enrollment
- `remove` veya `blur` gizleme modu
- Vitest ile birim testler

## Mimari

- `src/content/content.ts`:
  - Timeline'daki tweet kartlarını izler.
  - Görsellerden yüz descriptor'ı çıkarır.
  - Kayıtlı profil descriptor'larıyla mesafe karşılaştırır.
  - Eşik altında eşleşme varsa tweet'i gizler.
- `src/options/options.ts`:
  - Ayarları yönetir (`enabled`, `threshold`, `hideMode`).
  - Kullanıcının yüklediği fotoğraflardan descriptor çıkarıp profile kaydeder.
- `src/core/*`:
  - Depolama, model yükleme, matematik ve tweet filtre yardımcıları.

## Kurulum

1. Bağımlılıkları kur:

   `npm install`

2. Model dosyalarını indir:

   `npm run download-models`

3. Build al:

   `npm run build`

4. Chrome'da yükle:
   - `chrome://extensions`
   - **Developer mode** aç
   - **Load unpacked**
   - Proje içindeki `dist` klasörünü seç

## Model / Eğitim Süreci

Bu projede klasik anlamda yeniden model eğitimi yerine **embedding tabanlı enrollment** yapılır:

1. Options sayfasını aç.
2. Profil adı gir (örn: `j`).
3. Hedef kişiye ait çoklu fotoğraf yükle (öneri: 10+ farklı açı/ışık).
4. **Profili Eğit (Embed Oluştur)** butonuna bas.
5. Uzantı bu fotoğraflardan yüz descriptor'larını çıkarıp depolar.

Eşleşme kararı, descriptor mesafesine göre verilir:

$$
d(a,b)=\sqrt{\sum_{i=1}^{n}(a_i-b_i)^2}
$$

Burada $d \leq threshold$ ise eşleşme kabul edilir.

## Kalite / Yazılım Prensipleri

- Clean code: sorumluluklar `core`, `content`, `options`, `popup` olarak ayrıldı.
- Test edilebilirlik: matematik ve DOM filtre fonksiyonları ayrı modüllerde.
- İdempotent depolama erişimi: `getStorage()` default state üretir.
- Tip güvenliği: strict TypeScript.

## Test

- Tüm testler:

  `npm test`

- İzleme modu:

  `npm run test:watch`

## Geliştirme Notları

- Performans için ilk eşleşmede tweet gizlenir, gereksiz işlem kesilir.
- Çok düşük eşik kaçırma, çok yüksek eşik false-positive üretir.
- Başlangıç için öneri: `0.47`.

## Gelecek İyileştirmeler

- Web Worker ile yüz çıkarımını ana thread dışına almak
- Görsel hash cache ile tekrar hesaplamayı azaltmak
- Profil bazlı ayrı eşik ayarı
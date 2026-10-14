# Melda'nın Ajandası - Web Geliştirme Javascript Projesi

Bu proje, temel modern web teknolojileri (HTML5, CSS3, JavaScript) ve tarayıcı yerel veri saklama mekanizması (`LocalStorage`) kullanılarak geliştirilmiş kişisel bir ajanda / TODO uygulamasıdır.

## Proje Klasör Ağacı
Yönergeye uygun olarak modüler bir dosya yapısı benimsenmiştir:
- **`Components/`**: Arayüz stil tanımlamaları (`style.css`).
- **`Pages/`**: Uygulamanın temel JavaScript ve CRUD mantığı (`main.js`).
- **`Interfaces/`**: Veri modellerinin şematik tanımları (`taskInterface.js`).
- **`screenshots/`**: Proje test ve arayüz ekran görüntüleri.
- **`index.html`**: Giriş noktası.

## Özellikler
- **Ekleme (Create):** Görev adı ve öncelik rengi (Kırmızı/Acil, Pembe/Gereken, Mavi/Normal) seçilerek listeye eklenir.
- **Listeleme (Read):** Eklenen veriler Tümü, Bekleyenler ve Bitenler sekmeleri altında anlık filtrelenir.
- **Güncelleme (Update):** Notlar "Düzenle" seçeneği ile form üzerinden revize edilebilir, checkbox ile bitti durumu işaretlenir.
- **Silme (Delete):** "Sil" butonu ile onay alınarak liste kaydı silinir.
- **LocalStorage:** Sayfa kapansa da veriler tarayıcı belleğinde güvenle korunur.

## Çalıştırma Talimatı
`index.html` dosyasını doğrudan herhangi bir tarayıcıda açabilirsiniz.
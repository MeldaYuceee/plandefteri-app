// Plan Defteri - JavaScript & LocalStorage CRUD Islemleri
var gorevListesi = [];
var suAnkiFiltre = "hepsi";
var secilenDuzenlemeId = null;

// Sayfa yuklendiginde baslat
window.addEventListener("DOMContentLoaded", function() {
  verileriGetir();
  tarihiYaz();
  listele();
});

// Tarih Bilgisini Bas
function tarihiYaz() {
  var bugun = new Date();
  var secenek = { day: 'numeric', month: 'long', weekday: 'short' };
  var el = document.getElementById("tarihAlani");
  if (el) {
    el.innerText = bugun.toLocaleDateString("tr-TR", secenek);
  }
}

// 1. LOCALSTORAGE VERI YONETIMI
function verileriGetir() {
  var saklanan = localStorage.getItem("plan_defteri_veriler");
  if (saklanan !== null) {
    gorevListesi = JSON.parse(saklanan);
  } else {
    gorevListesi = [
      { id: 101, metin: "Netlify uzerinden projeyi canliya al", oncelik: "Acil", bitti: false },
      { id: 102, metin: "GitHub reposuna dosyalari yukle", oncelik: "Normal", bitti: false },
      { id: 103, metin: "Arayuz ekran goruntusunu kaydet", oncelik: "Gereken", bitti: true }
    ];
    verileriSakla();
  }
}

function verileriSakla() {
  localStorage.setItem("plan_defteri_veriler", JSON.stringify(gorevListesi));
}

// 2. LISTELEME ISLEMI (READ)
function listele() {
  var container = document.getElementById("listeAlani");
  var bosUyari = document.getElementById("bosUyari");
  var sayac = document.getElementById("sayacYazisi");

  container.innerHTML = "";

  var filtrelenmis = [];
  for (var i = 0; i < gorevListesi.length; i++) {
    var item = gorevListesi[i];
    if (suAnkiFiltre === "acik" && item.bitti === false) {
      filtrelenmis.push(item);
    } else if (suAnkiFiltre === "biten" && item.bitti === true) {
      filtrelenmis.push(item);
    } else if (suAnkiFiltre === "hepsi") {
      filtrelenmis.push(item);
    }
  }

  if (filtrelenmis.length === 0) {
    bosUyari.style.display = "block";
  } else {
    bosUyari.style.display = "none";
  }

  for (var j = 0; j < filtrelenmis.length; j++) {
    var g = filtrelenmis[j];
    var li = document.createElement("li");
    li.className = "kart" + (g.bitti ? " tamamlandi" : "");

    var tikDurumu = g.bitti ? "checked" : "";

    li.innerHTML = 
      '<div class="sol-bilgi">' +
        '<input type="checkbox" ' + tikDurumu + ' onchange="durumTersle(' + g.id + ')">' +
        '<span class="nokta nokta-' + g.oncelik + '"></span>' +
        '<span class="baslik">' + g.metin + '</span>' +
      '</div>' +
      '<div class="butonlar">' +
        '<button type="button" class="btn-duzenle" onclick="duzenlemeyiBaslat(' + g.id + ')">Düzenle</button>' +
        '<button type="button" class="btn-sil" onclick="silmeYap(' + g.id + ')">Sil</button>' +
      '</div>';

    container.appendChild(li);
  }

  if (sayac) {
    sayac.innerText = gorevListesi.length + " görev";
  }
}

// 3. EKLEME VE GUNCELLEME ISLEMI (CREATE & UPDATE)
function kaydetGuncelle() {
  var input = document.getElementById("gorevMetni");
  var select = document.getElementById("gorevOnceligi");
  var deger = input.value.trim();

  if (deger === "") {
    alert("Lütfen yapılacak bir iş yazın!");
    input.focus();
    return;
  }

  if (secilenDuzenlemeId !== null) {
    // Guncelleme islemi
    for (var k = 0; k < gorevListesi.length; k++) {
      if (gorevListesi[k].id === secilenDuzenlemeId) {
        gorevListesi[k].metin = deger;
        gorevListesi[k].oncelik = select.value;
        break;
      }
    }
    duzenlemedenVazgec();
  } else {
    // Yeni ekleme islemi
    var yeniGorev = {
      id: new Date().getTime(),
      metin: deger,
      oncelik: select.value,
      bitti: false
    };
    gorevListesi.unshift(yeniGorev);
  }

  input.value = "";
  verileriSakla();
  listele();
}

function duzenlemeyiBaslat(id) {
  var bulunan = null;
  for (var m = 0; m < gorevListesi.length; m++) {
    if (gorevListesi[m].id === id) {
      bulunan = gorevListesi[m];
      break;
    }
  }

  if (bulunan) {
    secilenDuzenlemeId = id;
    document.getElementById("gorevMetni").value = bulunan.metin;
    document.getElementById("gorevOnceligi").value = bulunan.oncelik;

    var btn = document.getElementById("islemButonu");
    btn.innerText = "Kaydet";
    btn.style.background = "linear-gradient(135deg, #38bdf8, #6366f1)";

    document.getElementById("vazgecButonu").style.display = "inline-block";
    document.getElementById("gorevMetni").focus();
  }
}

function duzenlemedenVazgec() {
  secilenDuzenlemeId = null;
  document.getElementById("gorevMetni").value = "";
  document.getElementById("gorevOnceligi").value = "Normal";

  var btn = document.getElementById("islemButonu");
  btn.innerText = "Ekle";
  btn.style.background = "linear-gradient(135deg, #ff3377, #ef233c)";

  document.getElementById("vazgecButonu").style.display = "none";
}

// 4. SILME ISLEMI (DELETE)
function silmeYap(id) {
  if (confirm("Bu görevi silmek istediğinize emin misiniz?")) {
    var guncel = [];
    for (var n = 0; n < gorevListesi.length; n++) {
      if (gorevListesi[n].id !== id) {
        guncel.push(gorevListesi[n]);
      }
    }
    gorevListesi = guncel;
    verileriSakla();
    listele();
  }
}

// Durum Degistir (Tamamlandi / Bitti)
function durumTersle(id) {
  for (var p = 0; p < gorevListesi.length; p++) {
    if (gorevListesi[p].id === id) {
      gorevListesi[p].bitti = !gorevListesi[p].bitti;
      break;
    }
  }
  verileriSakla();
  listele();
}

// Filtre Degistir
function filtreDegistir(tur) {
  suAnkiFiltre = tur;
  document.getElementById("flt-hepsi").className = (tur === "hepsi" ? "aktif" : "");
  document.getElementById("flt-acik").className = (tur === "acik" ? "aktif" : "");
  document.getElementById("flt-biten").className = (tur === "biten" ? "aktif" : "");
  listele();
}

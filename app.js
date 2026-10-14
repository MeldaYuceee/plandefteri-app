// LocalStorage ve Veri Yapisi
var ajandaVerileri = [];
var aktifFiltre = "hepsi";
var guncellenenId = null;

window.addEventListener("DOMContentLoaded", function() {
  verileriCek();
  tarihiYazdir();
  renderEt();
});

function tarihiYazdir() {
  var bugun = new Date();
  var secenekler = { day: 'numeric', month: 'long', weekday: 'short' };
  document.getElementById("bugunTarih").innerText = bugun.toLocaleDateString("tr-TR", secenekler);
}

// 1. LOCALSTORAGE KAYIT ISLEMLERI
function verileriCek() {
  var hafiza = localStorage.getItem("melda_ajanda_notlari");
  if (hafiza !== null) {
    ajandaVerileri = JSON.parse(hafiza);
  } else {
    // Sayfa ilk defa acildiginda gorunecek ornek notlar
    ajandaVerileri = [
      { id: 1, metin: "Javascript projesini Netlify uzerinden yayina al", oncelik: "Acil", bitti: false },
      { id: 2, metin: "GitHub reposuna kodlari ve ekran goruntusunu yukle", oncelik: "Gereken", bitti: false },
      { id: 3, metin: "Formdaki dosyalari kontrol et", oncelik: "Normal", bitti: true }
    ];
    hafizayaYaz();
  }
}

function hafizayaYaz() {
  localStorage.setItem("melda_ajanda_notlari", JSON.stringify(ajandaVerileri));
}

// 2. LISTELEME (READ)
function renderEt() {
  var liste = document.getElementById("ajandaListesi");
  var bosUyari = document.getElementById("bosUyari");
  var sayac = document.getElementById("sayacMetni");

  liste.innerHTML = "";

  var gosterilecekler = [];
  for (var i = 0; i < ajandaVerileri.length; i++) {
    var eleman = ajandaVerileri[i];
    if (aktifFiltre === "acik" && eleman.bitti === false) {
      gosterilecekler.push(eleman);
    } else if (aktifFiltre === "biten" && eleman.bitti === true) {
      gosterilecekler.push(eleman);
    } else if (aktifFiltre === "hepsi") {
      gosterilecekler.push(eleman);
    }
  }

  if (gosterilecekler.length === 0) {
    bosUyari.style.display = "block";
  } else {
    bosUyari.style.display = "none";
  }

  for (var j = 0; j < gosterilecekler.length; j++) {
    var n = gosterilecekler[j];
    var li = document.createElement("li");
    li.className = "not-kart" + (n.bitti ? " tamamlandi" : "");

    var tik = n.bitti ? "checked" : "";

    li.innerHTML = 
      '<div class="sol-taraf">' +
        '<input type="checkbox" ' + tik + ' onchange="tamamlandiDegistir(' + n.id + ')">' +
        '<span class="oncelik-noktasi nokta-' + n.oncelik + '"></span>' +
        '<span class="not-yazi">' + n.metin + '</span>' +
      '</div>' +
      '<div class="aksiyonlar">' +
        '<button class="btn-edit" onclick="duzenleModu(' + n.id + ')">Düzenle</button>' +
        '<button class="btn-del" onclick="notuSil(' + n.id + ')">Sil</button>' +
      '</div>';

    liste.appendChild(li);
  }

  sayac.innerText = ajandaVerileri.length + " görev";
}

// 3. EKLEME VE GUNCELLEME (CREATE & UPDATE)
function gorevEkleGuncelle() {
  var input = document.getElementById("gorevGirdisi");
  var select = document.getElementById("oncelikGirdisi");
  var deger = input.value.trim();

  if (deger === "") {
    alert("Boş bırakamazsınız, lütfen bir plan yazın!");
    input.focus();
    return;
  }

  if (guncellenenId !== null) {
    // Duzenleme
    for (var k = 0; k < ajandaVerileri.length; k++) {
      if (ajandaVerileri[k].id === guncellenenId) {
        ajandaVerileri[k].metin = deger;
        ajandaVerileri[k].oncelik = select.value;
        break;
      }
    }
    duzenlemeyiKapat();
  } else {
    // Yeni ekleme
    var yeni = {
      id: new Date().getTime(),
      metin: deger,
      oncelik: select.value,
      bitti: false
    };
    ajandaVerileri.unshift(yeni);
  }

  input.value = "";
  hafizayaYaz();
  renderEt();
}

function duzenleModu(id) {
  var bulunan = null;
  for (var m = 0; m < ajandaVerileri.length; m++) {
    if (ajandaVerileri[m].id === id) {
      bulunan = ajandaVerileri[m];
      break;
    }
  }

  if (bulunan) {
    guncellenenId = id;
    document.getElementById("gorevGirdisi").value = bulunan.metin;
    document.getElementById("oncelikGirdisi").value = bulunan.oncelik;

    var btn = document.getElementById("anaIslemBtn");
    btn.innerText = "Kaydet";
    btn.style.background = "linear-gradient(135deg, #38bdf8, #6366f1)";

    document.getElementById("vazgecBtn").style.display = "inline-block";
    document.getElementById("gorevGirdisi").focus();
  }
}

function duzenlemeyiKapat() {
  guncellenenId = null;
  document.getElementById("gorevGirdisi").value = "";
  document.getElementById("oncelikGirdisi").value = "Normal";

  var btn = document.getElementById("anaIslemBtn");
  btn.innerText = "Plana Ekle";
  btn.style.background = "linear-gradient(135deg, #ff4d88, #e63946)";

  document.getElementById("vazgecBtn").style.display = "none";
}

// 4. SILME ISLEMI (DELETE)
function notuSil(id) {
  if (confirm("Bu planı listeden silmek istiyor musunuz?")) {
    var geciciDizi = [];
    for (var n = 0; n < ajandaVerileri.length; n++) {
      if (ajandaVerileri[n].id !== id) {
        geciciDizi.push(ajandaVerileri[n]);
      }
    }
    ajandaVerileri = geciciDizi;
    hafizayaYaz();
    renderEt();
  }
}

function tamamlandiDegistir(id) {
  for (var p = 0; p < ajandaVerileri.length; p++) {
    if (ajandaVerileri[p].id === id) {
      ajandaVerileri[p].bitti = !ajandaVerileri[p].bitti;
      break;
    }
  }
  hafizayaYaz();
  renderEt();
}

// Filtre Secimi
function filtreSec(tur) {
  aktifFiltre = tur;
  document.getElementById("flt-hepsi").className = (tur === "hepsi" ? "aktif" : "");
  document.getElementById("flt-acik").className = (tur === "acik" ? "aktif" : "");
  document.getElementById("flt-biten").className = (tur === "biten" ? "aktif" : "");
  renderEt();
}
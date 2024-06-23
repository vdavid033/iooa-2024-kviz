<template>
  <div class="relative fixed-center">
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-positive text-white">
        <div id class="text-h5 h5 full-width">
          <span><a id="clicks">1</a>. </span>
          <span id="pitanje"> {{ state.pitanje }} </span>
        </div>
      </q-banner>
      <q-img class="responzive-img" :src="state.image" :ratio="16 / 9" />
    </div>
    <div class="q-pa-md odgovori">
      <!-- pozivanje metode getLabelOdgovor koja provjerava pitanja i daje odgovore sukladno zadanome-->
      <q-radio
        v-for="odgovor in state.odgovori"
        v-bind:key="odgovor.id"
        v-model="state.odabraniOdgovor"
        :val="odgovor.id"
        :label="getLabelOdgovor(odgovor)"
        color="teal"
      />
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-btn
        id="PrihvatiOdgovor"
        color="white"
        text-color="black"
        label="Prihvati odgovor"
        @click="
          prikaziGumb();
          state.alert = true;
          state.odabraniOdgovor === state.tocanOdgovor.id
            ? (state.brojTocnih = state.brojTocnih + 1)
            : (state.brojNetocnih = state.brojNetocnih + 1);
        "
      />
      <q-btn
        id="PrihvatiIZavrsi"
        color="white"
        text-color="black"
        label="Prihvati i zavrsi"
        @click="
          state.odabraniOdgovor === state.tocanOdgovor.id
            ? (state.brojTocnih = state.brojTocnih + 1)
            : (state.brojNetocnih = state.brojNetocnih + 1);
          state.zavrsniPopup = true;
        "
        disabled
      />
      <q-btn
        id="Refresh"
        color="white"
        text-color="black"
        label="Ponovno pokreni kviz"
        disabled
      />
      <q-dialog v-model="state.alert" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">
              {{
                state.odabraniOdgovor === state.tocanOdgovor.id
                  ? "Točno!"
                  : "Netočno!"
              }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <!-- //biljna vrsta pripada u botaničku porodicu botanička porodica -->

            {{
              state.odabraniOdgovor === state.tocanOdgovor.id
                ? state.plant.latin_name +
                  " je latinski naziv za " +
                  state.tocanOdgovor.croatian_name
                : state.plant.latin_name +
                  " je latinski naziv za " +
                  state.tocanOdgovor.croatian_name
            }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="OK"
              color="primary"
              @click="
                handleClose();
                brPitanja();
              "
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Završni popup -->
      <q-dialog v-model="state.zavrsniPopup" persistent>
        <div>
          <!--State alert popup (zadnji odgovor) spojen sa završnim popup-om zbog prikaza -->
          <q-card>
            <q-card-section class="text-center">
              <div class="text-h6">
                {{
                  state.odabraniOdgovor === state.tocanOdgovor.id
                    ? "Točno!"
                    : "Netočno!"
                }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              {{
                state.odabraniOdgovor === state.tocanOdgovor.id
                  ? state.plant.latin_name +
                    " je latinski naziv za " +
                    state.tocanOdgovor.croatian_name
                  : state.plant.latin_name +
                    " je latinski naziv za " +
                    state.tocanOdgovor.croatian_name
              }}
            </q-card-section>

            <!--Rezultat popup-->

            <q-card-section class="text-center">
              <div class="text-h6" style="margin-bottom: 10px">Rezultat</div>

              <!--Uklonjen prikaz točnih i netočnih odgovora, prikazan samo postotak-->

              <!-- <q-card-section class="q-pt-none">
                Broj točnih odgovora: {{ state.brojTocnih }}
              </q-card-section>
              <q-card-section class="q-pt-none">
                Broj netočnih odgovora: {{ state.brojNetocnih }}
              </q-card-section> -->

              <q-card-section class="q-pt-none">
                {{ postotak }}% točnih odgovora
              </q-card-section>
              <div class="text-h6" style="margin-bottom: 10px">Ocjena</div>
              <q-card-section class="q-pt-none">
                {{ ocjena }}
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  label="Početna stranica"
                  color="primary"
                  v-close-popup
                  href="/"
                ></q-btn>
              </q-card-actions>
            </q-card-section>
          </q-card>
        </div>
      </q-dialog>
      <!--Kraj završnog popup-a-->
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from "vue";
import { axios } from "../boot/axios";
var clicks = 1;
export default {
  setup() {
    const state = reactive({
      tip_pitanja: 1,
      plant: {},
      pitanje: "",
      odgovori: [],
      odabraniOdgovor: {},
      tocanOdgovor: {},
      brojTocnih: 0,
      brojNetocnih: 0,
      image: "",
      alert: false,
      zavrsniPopup: false,
    });

    // svojstvo za izračun postotka točnih odgovora
    const postotak = computed(() => {
      return (state.brojTocnih / 10) * 100;
    });

    // svojstvo za izračun ocjene sukladno postotku točnih odgovora
    // postotak.value se koristi direktno u else/if da se izbjegne dodatna varijabla (.value jer "computed" vraća objekt sa property-em value)
    const ocjena = computed(() => {
      if (postotak.value < 50) {
        return "Nedovoljan (1) - F";
      } else if (postotak.value < 60) {
        return "Dovoljan (2) - D";
      } else if (postotak.value < 75) {
        return "Dobar (3) - C";
      } else if (postotak.value < 90) {
        return "Vrlo dobar (4) - B";
      } else {
        return "Izvrstan (5) - A";
      }
    });

    onMounted(async () => {
      await randomPlant();
      await getRandomBotanicalPlant();
      await getImage();
    });

    async function handleClose() {
      await randomPlant();
      await getRandomBotanicalPlant();
      await getImage(); //dodala sam ovo
    }
    //za dohvat slike
    async function getImage() {
      const json = await axios.get(
        `https://ivanturk.from.hr/image/${state.plant.id}`
      );
      const data = json.data.data;

      if (data) {
        if (
          Object.getOwnPropertyNames(json.data).length === 0 ||
          json.data.data === undefined
        ) {
          state.image = "";
        } else {
          const image = data;
          state.image = image.image_url;
        }
      } else {
        state.image = "";
      }
    }

    // funkcija koja dohvaca random plant species i postavlja vrijednost u state.plant
    async function randomPlant() {
      const jsonObject = await axios.get(
        `https://ivanturk.from.hr/plant_species/`
      );
      let randomPlant =
        jsonObject.data.data[
          Math.floor(Math.random() * jsonObject.data.data.length)
        ];

      // plant se sprema u state.plant
      state.plant = randomPlant;

      // u state.pitanje spremamo tekst pitanja
      state.pitanje = [
        "Koji je latinski naziv za " + state.plant.croatian_name + "?",
        "Koji je hrvatski naziv za " + state.plant.latin_name + "?",
        "Kojoj botaničkoj porodici pripada " + state.plant.croatian_name + "?",
        "Koja biljna vrsta se nalazi na slici?",
      ];
      const randomQuestionIndex = Math.floor(
        Math.random() * state.pitanje.length
      );
      state.tip_pitanja = randomQuestionIndex;
      state.pitanje = state.pitanje[randomQuestionIndex];
    }

    //pokušaj pisanja funkcije
    async function getAnswers() {
      if (state.pitanje == 0 || state.pitanje == 2) {
        getRandomBotanicalPlant();
        return state.plant.croatian_name;
      } else if (state.pitanje == 1 || state.pitanje == 3) {
        getRandomBotanicalPlant();
        return state.plant.latin_name;
      }
      return {
        getAnswers,
      };
    }

    // funkcija koja dohvaca random botanicke vrste i postavlja ih u listu odgovora state.odgovori
    async function getRandomBotanicalPlant() {
      const json = await axios.get(`https://ivanturk.from.hr/botanical_family`);
      const botanicalFamily = json.data.data;

      // funkcija koja dohvaca tocan odgovor i sprema ga u state.tocanOdgovor
      await getCorrectAnswerFromBotanicalFamily();

      let botanicList = [];
      botanicList.push(state.tocanOdgovor);

      // dok lista nema 2 odgovora, trazi i dodaj novi
      while (botanicList.length < 4) {
        let index = Math.round(Math.random() * (botanicalFamily.length - 1));
        let botanicObject = {
          id: botanicalFamily[index].id,
          latin_name: botanicalFamily[index].latin_name,
          croatian_name: botanicalFamily[index].croatian_name, // Adding Croatian name
        };

        ///// gledamo ako je odogovor već u listi, ako je je true-> break
        var found = false;
        for (var i = 0; i < botanicList.length; i++) {
          if (botanicList[i].id == botanicObject?.id) {
            found = true;
            break;
          }
        }
        ///// ukoliko nije odgovor u listi, dodaj ga
        if (!found) {
          botanicList.push(botanicObject);
        }

        // dodaje odgovor u listu samo ako takav odgovor vec ne postoji i ako odgovor nije jednak tocnom odgovoru
        /*if (
          botanicObject.id !== botanicList[0]?.id &&
          botanicObject.id !== state.tocanOdgovor?.id
        ) {
          botanicList.push(botanicObject);
        }*/
      }
      // nakon sto u listi odgovora imamo 2 razlicita odgovora, u listu dodajemo tocan odgovor
      // botanicList.push(state.tocanOdgovor);

      // pitanja u listi se sortiraju kako bi poredak bio random
      state.odgovori = botanicList
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      // prvi odgovor u listi postavlja se kao selektirani
      state.odabraniOdgovor = state.odgovori[0].id;
    }

    // funkcija dohvaca tocan odgovor za random plant species -> state.plant/
    async function getCorrectAnswerFromBotanicalFamily() {
      const json = await axios.get(
        `https://ivanturk.from.hr/plant_species/${state.plant.id}`
      );
      state.tocanOdgovor = json.data.data;
    }

    return {
      state,
      randomPlant,
      getRandomBotanicalPlant,
      getCorrectAnswerFromBotanicalFamily,
      handleClose,
      postotak,
      ocjena,
    };
  },
  methods: {
    prikaziGumb() {
      ("use strict");
      let button1 = document.getElementById("PrihvatiOdgovor");
      let button2 = document.getElementById("PrihvatiIZavrsi");
      let button3 = document.getElementById("Refresh");
      let count = 0;
      function buttonPressed(e) {
        count++;
        if (count === 8) {
          button2.removeAttribute("disabled", false);
          button3.removeAttribute("disabled", false);
          button2.innerHTML = "Prihvati i zavrsi";
          button1.setAttribute("disabled", true);
          button1.style.display = "none";
        }
      }
      button1.addEventListener("click", buttonPressed, true);
      button3.onclick = () => {
        window.location.reload();
      };
    },
    // PRORADILO... - Emina i Hrvoje
    getLabelOdgovor(odgovor) {
      const pitanje = this.state.pitanje;
      if (pitanje.includes("latinski naziv")) {
        return odgovor.latin_name;
      } else if (pitanje.includes("hrvatski naziv")) {
        return odgovor.croatian_name;
      } else if (pitanje.includes("botaničkoj")) {
        return odgovor.latin_name;
      } else if (pitanje.includes("nalazi na slici")) {
        return odgovor.croatian_name;
      }
    },

    brPitanja() {
      clicks += 1;
      document.getElementById("clicks").innerHTML = clicks;
    },
  },
};
</script>

<style>
/* Osnovna stilizacija */
.odgovori {
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  width: 700px;
  margin-left: 15px;
}

#pitanje {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 18px; /* Veći font za veće ekrane */
  margin: 10px 0; /* Dodajemo margine za bolji razmještaj */
}

.responsive-img {
  width: 100%;
  height: auto;
}

/* Stilizacija za manje ekrane */
@media only screen and (max-width: 1200px) {
  .odgovori {
    width: 100%;
    margin-left: 0;
  }
}

@media only screen and (max-width: 768px) {
  .odgovori {
    width: 100%; /* Osigurava da odgovori zauzimaju cijelu širinu */
    margin-left: 0;
    flex-direction: column;
    align-items: center;
  }

  .odgovori q-radio {
    width: 100%;
    margin-bottom: 10px;
  }

  #pitanje {
    font-size: 16px; /* Smanjujemo font za manje ekrane */
  }

  .q-toolbar__title {
    display: none;
  }

  .q-pa-md.q-gutter-sm {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .responsive-img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
}

@media only screen and (max-width: 375px) {
  .odgovori {
    width: 100%;
    padding: 10px; /* Dodajemo padding za bolji razmještaj na malim ekranima */
    align-items: center; /* Centriramo odgovore */
  }

  #pitanje {
    font-size: 14px; /* Dodatno smanjujemo font za vrlo male ekrane */
    margin: 10px 0; /* Dodajemo margine za bolji razmještaj */
    padding: 5px; /* Dodaje padding za bolje razmještanje */
    text-align: center; /* Osiguravamo centriranje teksta */
  }

  .odgovori q-radio {
    margin-bottom: 8px; /* Smanjujemo marginu između odgovora */
    width: 100%; /* Osiguravamo širinu odgovora */
    font-size: 12px;
  }

  .q-pa-md.q-gutter-sm {
    width: 100%; /* Osigurava širinu elemenata */
    padding: 10px; /* Dodajemo padding za bolji razmještaj */
    align-items: center; /* Centriramo elemente */
  }

  .responsive-img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
}

/* Dodatno podešavanje za veoma male ekrane */
@media only screen and (max-width: 320px) {
  #pitanje {
    font-size: 10px; /* Još dodatno smanjujemo font za najmanje ekrane */
    margin: 10px 0;
    padding: 5px;
  }

  .odgovori {
    padding: 5px;
  }

  .odgovori q-radio {
    margin-bottom: 5px;
  }

  .q-pa-md.q-gutter-sm {
    padding: 5px;
  }

  .responsive-img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
}
</style>

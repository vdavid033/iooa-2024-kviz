<template>
  <div class="relative fixed-center">
     <!-- Prikaz bodova -->
     <div class="q-pa-md">
      <div class="text-h6">Bodovi: {{ state.bodovi }}</div>
    </div>
    
    <div class="q-pa-md q-gutter-sm">
      <q-banner inline-actions rounded class="bg-positive text-white">
        <div id class="text-h5 h5 full-width">
          <span><a id="clicks">1</a>. </span>
          <span id="pitanje"> {{ state.pitanje }} </span>
          <span class="tezina"> (Težina: {{ state.tezina }}) </span> 
        </div>
      </q-banner>
      <q-img width="700px" height="350px" :src="state.image" :ratio="16 / 9" />
    </div>
    <div class="q-pa-md odgovori">
      <q-radio
        v-for="odgovor in state.odgovori"
        :key="odgovor.id"
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
    if (state.odabraniOdgovor === state.tocanOdgovor.id) {
      state.brojTocnih += 1;
      state.bodovi += state.tezina; // Dodaj bodove za točan odgovor
    } else {
      state.brojNetocnih += 1;
    }
  "
/>
<q-btn
  id="PrihvatiIZavrsi"
  color="white"
  text-color="black"
  label="Prihvati i završi"
  @click="
    if (state.odabraniOdgovor === state.tocanOdgovor.id) {
      state.brojTocnih += 1;
      state.bodovi += state.tezina; // Dodaj bodove za točan odgovor
    } else {
      state.brojNetocnih += 1;
    }
    state.zavrsniPopup = true;
  "
  disabled
/>
      <q-btn
        id="Refresh"
        color="white"
        text-color="black"
        label="Ponovno pokreni kviz"
        @click="window.location.reload()"
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
      <q-dialog v-model="state.zavrsniPopup" persistent>
        <div>
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
            <q-card-section class="text-center">
              <div class="text-h6" style="margin-bottom: 10px">Rezultat</div>
              <q-card-section class="q-pt-none">
                Broj točnih odgovora: {{ state.brojTocnih }}
              </q-card-section>
              <q-card-section class="q-pt-none">
                Broj netočnih odgovora: {{ state.brojNetocnih }}
              </q-card-section>
              <q-card-section class="q-pt-none">
                Ukupni bodovi: {{ state.bodovi }} 
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
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import axios from "axios";

var clicks = 1; // brojevi idu redom, ne ponavljaju se

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
      bodovi: 0, //bodovi
      image: "",
      alert: false,
      zavrsniPopup: false,
      tezina: 1, //tezina
    });

    
    onMounted(async () => {
      await randomPlant();
      await getRandomBotanicalPlant();
      await getImage();
    });

    async function handleClose() {
      await randomPlant();
      await getRandomBotanicalPlant();
      await getImage();
    }

    async function getImage() {
      const json = await axios.get(`http://localhost:3000/image/${state.plant.id}`);
      const data = json.data.data;

      if (data) {
        if (Object.getOwnPropertyNames(json.data).length === 0 || json.data.data === undefined) {
          state.image = "";
        } else {
          const image = data;
          state.image = image.image_url;
        }
      } else {
        state.image = "";
      }
    }

// Funkcija za generiranje novog pitanja
async function randomPlant() {
  const jsonObject = await axios.get(`http://localhost:3000/plant_species/`);
  let randomPlant = jsonObject.data.data[Math.floor(Math.random() * jsonObject.data.data.length)];
  state.plant = randomPlant;

  // Odredivanje tezine pitanja (nasumicna vrijednost izmedu 1 i 5)
  state.tezina = Math.floor(Math.random() * 5) + 1;


  // Dodavanje novog pitanje u listu pitanja
  state.pitanje = [
    "Koji je latinski naziv za " + state.plant.croatian_name + "?",
    "Koji je hrvatski naziv za " + state.plant.latin_name + "?",
    "Kojoj botaničkoj porodici pripada " + state.plant.croatian_name + "?",
    "Koja biljna vrsta se nalazi na slici?",
    "Koji je rod biljke za " + state.plant.latin_name + "?", // novo pitanje
    "Kojoj botaničkoj porodici pripada biljka sa slikom?" // novo pitanje
    
   
  ];

  
  const randomQuestionIndex = Math.floor(Math.random() * state.pitanje.length);
  state.tip_pitanja = randomQuestionIndex;
  state.pitanje = state.pitanje[randomQuestionIndex];


  // Pozivanje funkcije za dobivanje odgovora na osnovu tipa pitanja
  await getAnswers();
}


// Funkcija za dobivanje odgovora na osnovu tipa pitanja
async function getAnswers() {
  if (state.tip_pitanja === 5) {
    // Dohvati korisne dijelove biljke
    await getUsefulParts();
  } else {
    await getRandomBotanicalPlant();
  }
}



async function getAnswers() {
  if (state.tip_pitanja === 0 || state.tip_pitanja === 2) {
    await getRandomBotanicalPlant();
  } else if (state.tip_pitanja === 1 || state.tip_pitanja === 3) {
    await getRandomBotanicalPlant();
  } else if (state.tip_pitanja === 6) {
    await getUsefulParts();
  }
}


    // Funkcija koja dohvaća rod biljke
async function getGenus() {
  const json = await axios.get(
    `http://localhost:3000/plant_species/${state.plant.id}`
  );
  const data = json.data.data;

  // Spremi točan odgovor u state.tocanOdgovor
  state.tocanOdgovor = data;

  // Dohvati nasumične odgovore za rod biljaka
  const jsonObject = await axios.get(
    `http://localhost:3000/botanical_family`
  );
  const botanicalFamily = jsonObject.data.data;
  
  let genusList = [];
  genusList.push(state.tocanOdgovor);

  while (genusList.length < 4) {
    let index = Math.round(Math.random() * (botanicalFamily.length - 1));
    let genusObject = {
      id: botanicalFamily[index].id,
      latin_name: botanicalFamily[index].latin_name,
      croatian_name: botanicalFamily[index].croatian_name,
    };

    if (!genusList.some(g => g.id === genusObject.id)) {
      genusList.push(genusObject);
    }
  }

  state.odgovori = genusList
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  state.odabraniOdgovor = state.odgovori[0].id;
}


    async function getRandomBotanicalPlant() {
      const json = await axios.get(`http://localhost:3000/botanical_family`);
      const botanicalFamily = json.data.data;

      

      let botanicList = [];
      await getCorrectAnswerFromBotanicalFamily();
      botanicList.push(state.tocanOdgovor);

      while (botanicList.length < 4) {
        let index = Math.round(Math.random() * (botanicalFamily.length - 1));
        let botanicObject = {
          id: botanicalFamily[index].id,
          latin_name: botanicalFamily[index].latin_name,
          croatian_name: botanicalFamily[index].croatian_name,
        };

        var found = false;
        for (var i = 0; i < botanicList.length; i++) {
          if (botanicList[i].id == botanicObject?.id) {
            found = true;
            break;
          }
        }
        if (!found) {
          botanicList.push(botanicObject);
        }
      }
      state.odgovori = botanicList
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      state.odabraniOdgovor = state.odgovori[0].id;
    }

    async function getCorrectAnswerFromBotanicalFamily() {
      const json = await axios.get(`http://localhost:3000/plant_species/${state.plant.id}`);
      state.tocanOdgovor = json.data.data;
    }

    return {
      state,
      randomPlant,
      getRandomBotanicalPlant,
      getCorrectAnswerFromBotanicalFamily,
      handleClose,
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
          button2.removeAttribute("disabled");
          button3.removeAttribute("disabled");
          button2.innerHTML = "Prihvati i završi";
          button1.setAttribute("disabled", true);
          button1.style.display = "none";
        }
      }
      button1.addEventListener("click", buttonPressed, true);
    },
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
      } else if (pitanje.includes("rod biljke")) {  // Dodajemo novu provjeru
        return odgovor.croatian_name; //odgovori na hrvatskom
      } else if (pitanje.includes("dio biljke najčešće korišten")) { // Novo pitanje
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

.tezina {  /*css tezina*/
  font-size: 20px; 
  color: white; 
  margin-left: 10px; 
}

.q-card-section.q-pt-none {
  margin-bottom: 10px; /* Razmak između redaka */
}

.odgovori {
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  width: 700px;
  margin-left: 15px;
}

@media only screen and (max-width: 1200px) {
  .odgovori {
    width: 100%;
    margin-left: 0;
  }
}

@media only screen and (max-width: 768px) {
  .odgovori {
    flex-direction: column;
    align-items: center;
  }

  .odgovori q-radio {
    width: 100%;
    margin-bottom: 10px;
  }

  #pitanje {
    text-align: center;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 16px;
  }
  .q-toolbar__title {
    display: none;
  }
  .q-pa-md.q-gutter-sm {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
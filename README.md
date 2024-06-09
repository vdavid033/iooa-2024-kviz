# KVIZ O BILJNIM VRSTAMA

## UVOD

Web-aplikacija „Kviz o biljnim vrstama“ služi studentima stručnog studija Agroturizma za učenje o biljnim vrstama, formirajući kviz s različitim tipovima pitanja koji služi za provjeru njihovog znanja.

![Kviz](/DOKUMENTACIJA/IMAGES/Pocetna.png)

## FUNKCIONALNOSTI: 
 - Započni kviz
 - 10 random pitanja
 - 4 ponuđena odgovora za svako pitanje
 - Prigodna poruka (točno-netočno) nakon svakog odgovorenog pitanja
 - Prigodna poruka na kraju testa (zbroj točnih-netočnih odgovora)


 ![Pitanje](/DOKUMENTACIJA/IMAGES/PitanjePrimjer.png)![Kraj](/DOKUMENTACIJA/IMAGES/Kraj.png)



## ALATI
- VS code
- VUE.js(3.0.0)
- Quasar(2.6.0)
- axios(0.27.2)
- vue(3.0.0)
- vue-axios(3.4.1)
- vue-router(4.0.0)
- mySql(2.18.1)
- ExpressJS(4.19.2)
- NodeJS(12.22.1)
- body-parser(1.20.2)


## CLONE

```
$ git clone https://github.com/vdavid033/iooa-2024-kviz.git
```

## POKRETANJE APLIKACIJE

1. Na računalu kreirati mapu koju potom otvaramo pomoću VS Code-a (File -> Open folder -> odabir kreirane mape)
2. Otvorimo Terminal -> New Terminal
3. U terminalu pozvati naredbu za kloniranje i pričekati da se klonira
4. U terminalu se prebacimo u backend pomoću naredbe **cd backend**
5. Pozivamo naredbu za instalaciju potrebnih paketa **npm install express mysql cors body-parser** i pričekati da se instalira
6. naredbom **node index.js** pokrećemo backend
7. Otvaramo novi terminal te se pozicioniramo u frontend naredbom **cd frontend**
8. Potom je potrebno se pozicionirati u quasar pomoću naredbe **cd quasar-project**
9. I potom pokrećemo naredbu **npm install** te pričekamo da se instalacija završi
10. Pozivamo naredbu **quasar dev** i aplikacija se pokreće

Frontend:
http://localhost:8080/#/kviz5

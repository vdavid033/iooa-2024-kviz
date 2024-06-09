# iooa-2024-kviz
Features: 
 - Start the quiz (Započni kviz)
   
 - 10 random questions about plant species, croatian and latin names and discovering what kind of plant is in the picture
    - 4 types of question:
       - 1. type of question is: "Koji je latinski naziv za " + state.plant.croatian_name
       - 2. type of question is: "Koji je hrvatski naziv za " + state.plant.latin_name
       - 3. type of question is: "Kojoj botaničkoj porodici pripada " + state.plant.croatian_name
       - 4. type of question is: "Koja biljna vrsta se nalazi na slici "
            
 - every question has 4 answers (one is correct)
    - where is question "Koji je latinski naziv..." the application displays  latin answers (names) from database
    - where is question "Koji je hrvatski naziv..." the application displays  croatioan answers (names) from database
    - where is question "Kojoj botaničkoj vrsti..." the application displays  latin answers (names) from database
    - where is question "Koja biljna vrsta se nalazi na slici" the application displays  latin answers (names) from database
      
 - After each answered question, the application shows the user a notification about the answer is correct or not
   
 - When the user answers all the question, application will display a message with the sum of correct and incorrect answers

Frontend:
http://localhost:8080/#/kviz5

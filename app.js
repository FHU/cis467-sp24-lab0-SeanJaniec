const facts = require('./facts.json')

const express = require('express')
const app = express()

const cheerio = require('cheerio');


app.use(express.static('public'));

const PORT = process.env.PORT || "3000"

app.set('view engine', 'ejs')

app.listen(PORT, ()=> {
    console.log( `App is running on http://localhost:${PORT}...`)
})

async function fetchRandomDadJoke() {
    try {
      const dadJoke = await fetch('https://icanhazdadjoke.com/'); 
      const joke = await dadJoke
      if (dadJoke.ok) {
        console.log('Random Dad Joke:', joke);
        return joke;
      } else {
        console.error('Failed to fetch dad joke:', joke.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching dad joke:', error);
      return null;
    }
  }

app.get("/", (req, res) => {

    const welcome = 'EmperorZurg welcomes you to Lab0!'

    res.render('welcome', {welcome})
    

})

// http://localhost:3000/greet?name=kaylee&dob=2002
app.get('/greet', (req, res) => {
    const name = req.query.name;
    const dob = req.query.dob;

  
    const age1 = 2024 - parseInt(dob);
    const age2 = 2023 - parseInt(dob);
  
    
    const response = `Hello, ${name}!, you are ${age2} or ${age1} years old!`;

    res.render('greet', { response })
    
  });
  

app.get('/math/:num1/:op/:num2', (req, res)=> {
    
    if(req.params.op == 'plus')
    {
        const result = parseInt(req.params.num1) + parseInt(req.params.num2);
        res.render('math', { result })

    }
    else if (req.params.op == 'minus')
    {
        const result = parseInt(req.params.num1) - parseInt(req.params.num2);
        res.render('math', { result })
    }
    else if (req.params.op == 'times')
    {
        const result = parseInt(req.params.num1) * parseInt(req.params.num2);
        res.render('math', { result })
    }
    else if (req.params.op == 'dividedby')
    {
        const result = parseInt(req.params.num1) / parseInt(req.params.num2);
        res.render('math', { result })
    }
    else if (req.params.op == 'tothepowerof')
    {
        const result = parseInt(req.params.num1) ** parseInt(req.params.num2);
        res.render('math', { result })
    }

})



app.get('/pandorasbox', async (req, res)=> {

    // do the work
    const length = facts.length;
    const random = Math.floor( Math.random() * length)
    const fact4 = facts[random].fact
    const message = fact4
    
    try {
        const dadJokeResponse = await fetchRandomDadJoke();
        const dadJokeHTML = await dadJokeResponse.text();

        const $ = cheerio.load(dadJokeHTML);
        const dadJoke = $('body').text().trim();

        res.render('pandorasbox', { title: "Pandora's Box", message, dadJoke });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
})
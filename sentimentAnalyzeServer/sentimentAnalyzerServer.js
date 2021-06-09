const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();
app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities':{
                'emotion': true,
                'sentiment': false
                //'limit':1
            },
            'keywords':{
                'emotion': true,
                'sentiment': false
               // 'limit': 1,
            }
        }
    }

    getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {

    console.log(analysisResults.result.entities);

    const NLUresult = analysisResults.result.entities[0].emotion;
    //let myObj = JSON.parse(result);
    return res.send(NLUresult);
  })
  .catch(err => {
    console.log('error:', err);
  });

    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
        const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities':{
                'emotion': false,
                'sentiment': true
                //'limit':1
            },
            'keywords':{
                'emotion': false,
                'sentiment': true
               // 'limit': 1,
            }
        }
    }

    getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {

    console.log(analysisResults.result.entities);

    const NLUresultSentiment = analysisResults.result.entities[0].sentiment;
    //let myObj = JSON.parse(result);
    return res.send(NLUresultSentiment);
  })
  .catch(err => {
    console.log('error:', err);
  });
   //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams =   {'text': req.query.text,
     'features': {
        'keywords': {
        'sentiment': true,
      'emotion': true,
      'limit': 1
    }
  }
};

    getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {
    let result = JSON.stringify(analysisResults, null, 2);
    let myObj = JSON.parse(result);
    let x = myObj.result.keywords;
    return res.send(x[0].emotion);
  })
  .catch(err => {
    console.log('error:', err);
  });
    
}
);

app.get("/text/sentiment", (req,res) => {

    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities':{
                'emotion': false,
                'sentiment': true
                //'limit':1
            },
            'keywords':{
                'emotion': false,
                'sentiment': true
               // 'limit': 1,
            }
        }
    }

    

    getNLUInstance().analyze(analyzeParams).then(analysisResults => {

    console.log(analysisResults.result.keywords[0].sentiment.label);

    const SentimentText = analysisResults.result.keywords[0].sentiment;
    //let myObj = JSON.parse(result);
    return res.send(SentimentText);
  })
  .catch(err => {
    console.log('error:', err);
  });

    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

function getNLUInstance (){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}


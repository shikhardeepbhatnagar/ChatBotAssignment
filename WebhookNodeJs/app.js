const express = require('express')
const { WebhookClient,Card, Suggestion, Payload } = require('dialogflow-fulfillment')
const { PLATFORMS } = require('dialogflow-fulfillment/src/rich-responses/rich-response')
const app = express()
var isFundSelected = false 
var folioOptions = []
var registeredPhoneNumber = ""

//data
const equityFundDataDictionary = {"Nippon India Small Cap Fund": "High Growth Potential — Seize the Opportunity to invest in Future Market Leaders with Nippon India Small Cap Fund. Invest in Small Cap Companies across different sectors with Nippon India Small Cap Fund.\nhttps://mf.nipponindiaim.com/FundsAndPerformance/Pages/NipponIndia-Small-Cap-Fund.aspx",
                                  "ICICI Prudential Fund": "Investment Made Easy With IPru — Choose The Smart Way Of Savings With ICICI Prudential Mutual Fund. Unlock Your Savings Potential With ICICI Prudential Mutual Fund. Long Term Investment Plan.\nhttps://www.icicipruamc.com/",
                                  "SBI Blue Chip Fund": "Bluechip funds are those funds that invest in stocks of well established companies which have proved to perform financially well over a long period of time.\nhttps://www.sbimf.com/mutual-fund/equity-mutual-funds"};

const debtFundDataDictionary = {"Hdfc Liquid Fund": "Liquid Fund :Liquid Fund : The fund has 91.1% investment in Debt, of which 15.48% in Government securities, 75.62% is in Low Risk securities.\nhttps://www.hdfcfund.com/product-solutions/overview/hdfc-liquid-fund/direct",
                                "Kotak Liquid Fund": "Liquid Fund :Liquid Fund : The fund has 92.56% investment in Debt, of which 9.32% in Government securities, 83.24% is in Low Risk securities.\nhttps://www.kotakmf.com/mutual-funds/liquid-funds/kotak-liquid-fund/dir-g",
                                "Axis Liquid Fund": "The scheme seeks to provide a high level of liquidity along with reasonable returns through investments in money and other short-term debt instruments.\nhttps://www.axismf.com/mutual-funds/debt-funds/axis-liquid-fund/cf-dg/direct"
                                };

const hybridFundDataDictionary = {"SBI Equity Hybrid Fund": "Hybrid funds are an investment in both debt amp; equity schemes to maintain a balance between risk amp; returns. Visit SBI Mutual Fund ... Equity Mutual Funds.\nhttps://www.sbimf.com/mutual-fund/equity-mutual-funds",
                                  "Hdfc Balanced Fund": "Investment Strategy. The Scheme seeks to provide long term capital appreciation / income from a dynamic mix of equity and debt investments. Suitability.\nhttps://www.hdfcfund.com/product-solutions/overview/hdfc-balanced-advantage-fund/direct",
                                  "Dsp Fund": "DSP Mutual Fund is a mutual fund investment company in India. Invest in all types of mutual fund schemes online with DSP today.\nhttps://www.dspim.com/"};

const dummyData = {
  "2022-04-01": "2022-04-01: Hdfc Balanced Fund - Amount: 100",
  "2022-07-02": "2022-07-02: Nippon India Small Cap Fund - Amount: 200",
  "2023-03-31": "2023-03-31: SBI Blue Chip Fund - Amount: 300",
  "2023-09-05": "2023-09-05: Dsp Fund - Amount: 1000",
  "2024-01-31": "2024-01-31: ICICI Prudential Fund - Amount: 1800",
  "2024-03-31": "2024-03-31: Kotak Liquid Fund - Amount: 300",
}

const folioDummyDataForSecondNumber = {
  "PAN_1234": "Your folio Shikhar_1995, Valuation is 2 CR INR on ",
  "PAN_2312": "Your folio Shikhar_2023, Valuation is 4 CR INR on "
}

const folioDummyDataForOneNumber = {
  "PAN_123": "Your folio SomeUser_1995, Valuation is 1 CR INR on ",
  "PAN_231": "Your folio SomeUser_1996, Valuation is 0.5 CR INR on "
}

const transactionDictionary = {"8800799947": dummyData,
                               "9760434722": dummyData}

const folioDictionary = {"8800799947": folioDummyDataForSecondNumber,
                         "9760434722": folioDummyDataForOneNumber}

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

 function investFunc()
 {
    if(isFundSelected)
    {
        if(!agent.getContext("greetings").parameters.phonenumber)
        {
            agent.setFollowupEvent("followupInventEvent")
        }
        else
        {
            agent.clearContext('greetings')
            agent.add("Thank you for choosing our services")
        }
        isFundSelected = false
    }
    else
        agent.add("Please choose fund from fund explorer")
 }

 function equityFundFunc(agent) {
    var list = Object.keys(equityFundDataDictionary);
    if(!agent.parameters.optionnumber)
      agent.add("To select from the below option(s),\nEnter option number:\nEnter 1: " + list[0] + "\nEnter 2: " + list[1] + "\nEnter 3: " + list[2])
      
     const option = agent.parameters.optionnumber
     switch(option)
     {
        case 1: 
//         const help = {    
          
//           "text": "Can I help you with anything else?",
//           "reply_markup": {
//             "inline_keyboard": [
//               [
//                 {
//                   "callback_data": "yes",
//                   "text": "1 - Yes"
//                 },
//                 {
//                   "text": "2 - No",
//                   "callback_data": "no"
//                 }
//               ]
//             ]
//           }
        
//       }


// agent.add(new 
//         Payload(agent.TELEGRAM, help, { rawPayload: true, sendAsMessage: true }))
                agent.add(new Suggestion(`Invest`));
                agent.add(new Suggestion(`Main menu`));
                isFundSelected = true
            break;
        case 2: agent.add(equityFundDataDictionary["ICICI Prudential Fund"])
                agent.add(new Suggestion(`Invest`));
                agent.add(new Suggestion(`Main menu`));
                isFundSelected = true
            break;
        case 3: agent.add(equityFundDataDictionary["SBI Blue Chip Fund"])
        agent.add(new Suggestion(`Invest`));
        agent.add(new Suggestion(`Main menu`));
                isFundSelected = true
            break;
        default: 
            agent.setFollowupEvent("invokeEquityFundIntentEvent")
            break;
     }
  }

  function debtFundFunc(agent) {
    var list = Object.keys(debtFundDataDictionary);
    if(!agent.parameters.optionnumber)
      agent.add("To select from the below option(s),\nEnter option number:\nEnter 1: " + list[0] + "\nEnter 2: " + list[1] + "\nEnter 3: " + list[2])
      
     const option = agent.parameters.optionnumber
     switch(option)
     {
      case 1: agent.add(debtFundDataDictionary["Hdfc Liquid Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      case 2: agent.add(debtFundDataDictionary["Kotak Liquid Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      case 3: agent.add(debtFundDataDictionary["Axis Liquid Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      default: 
        agent.setFollowupEvent("invokeDebtFundIntentEvent")
        break;
     }
  }

  function hybridFundFunc(agent) {
    var list = Object.keys(hybridFundDataDictionary);
    if(!agent.parameters.optionnumber)
      agent.add("To select from the below option(s),\nEnter option number:\nEnter 1: " + list[0] + "\nEnter 2: " + list[1] + "\nEnter 3: " + list[2])
      
     const option = agent.parameters.optionnumber
     switch(option)
     {
      case 1: agent.add(hybridFundDataDictionary["SBI Equity Hybrid Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      case 2: agent.add(hybridFundDataDictionary["Hdfc Balanced Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      case 3: agent.add(hybridFundDataDictionary["Dsp Fund"])
      agent.add(new Suggestion(`Invest`));
      agent.add(new Suggestion(`Main menu`));
        isFundSelected = true
        break;
      default: 
        agent.setFollowupEvent("invokeHybridFundIntentEvent")
        break;
     }
  }

  function greetingsFollowupPortfolio(agent)
  {
    if(agent.parameters.phonenumber in folioDictionary)
    {
      let tempObj = folioDictionary[agent.parameters.phonenumber]
      registeredPhoneNumber = agent.parameters.phonenumber
      agent.add("Please select your folio");
      for (const [key, value] of Object.entries(tempObj)) 
      {
        agent.add(new Suggestion(key))
        folioOptions.push(key)
      }
    }
    else
    {
      agent.add("Your number is not registered with us.")
      agent.add(new Suggestion(`Main menu`))
    }
  }

  function folioSelectionFunc(agent)
  {
    if(folioOptions.includes(req.body.queryResult.queryText.toString().toUpperCase())){
      var item = folioDictionary[registeredPhoneNumber]
      agent.add(item[req.body.queryResult.queryText.toString().toUpperCase()]+new Date())
      folioOptions = []
      registeredPhoneNumber = ""
    }
    else{
      agent.add("Please select your folio");
      for (var i = 0; i < folioOptions.length; i++) 
      {
        agent.add(new Suggestion('folioOptions[i]'))
      }
    }
  }

  function greetingsFollowupTransaction(agent)
  {
    let startDate = new Date(agent.parameters.dateperiod.startDate.split('T')[0])
    let endDate = new Date(agent.parameters.dateperiod.endDate.split('T')[0])
    printTransactions(agent, startDate, endDate, agent.parameters.phonenumber)
  }

  function printTransactions(agent, startDate, endDate, phonenumber)
  {
    let transactions = "";
    if(phonenumber in transactionDictionary)
    {
      let tempObj = transactionDictionary[phonenumber];
      
      for (const [key, value] of Object.entries(tempObj)) 
      {
        var dateKey = new Date(key)
        if(dateKey >= startDate & dateKey <= endDate)
        {
          transactions = transactions + value + "\n"
        }
      }

      if(transactions === "")
      {
        agent.add("No transaction registered in the provided timeline")
      }
      else
      {
        agent.add(transactions)
      }

      agent.add("Do you want to invest more?")
    }
    else
    {
      agent.add("We don't have transaction on this number")
    }
  }

  function transactionWithoutQuery(agent)
  {
    if(req.body.queryResult.queryText.toString().toLowerCase().includes("current"))
    {
      let startDate = new Date("2023-04-01")
      let endDate = new Date("2024-03-31")
      printTransactions(agent, startDate, endDate, agent.getContext("greetings").parameters.phonenumber)
    }
    else if(req.body.queryResult.queryText.toString().toLowerCase().includes("last"))
    {
      let startDate = new Date("2022-04-01")
      let endDate = new Date("2023-03-31")
      printTransactions(agent, startDate, endDate, agent.getContext("greetings").parameters.phonenumber)
    }
    else
    {
      let startDate = new Date(req.body.queryResult.queryText.toString().split(' - ')[0]);
      let endDate = new Date(req.body.queryResult.queryText.toString().split(' - ')[1]);
      let todaysDate = new Date()
      if(startDate > todaysDate)
      {
        agent.add("future date")
      }
      else
      {
        printTransactions(agent, startDate, endDate, agent.getContext("greetings").parameters.phonenumber)
      }
    }
  }

  function investMoreFunc(agent){
    agent.setFollowupEvent("fundExplorerEvent")
  }

  let intentMap = new Map()
  intentMap.set('equity-fund-intent', equityFundFunc);
  intentMap.set('debt-fund-intent', debtFundFunc);
  intentMap.set('hybrid-fund-intent', hybridFundFunc);
  intentMap.set('invest-intent', investFunc);
  intentMap.set('greetings-followup-portfolio', greetingsFollowupPortfolio);
  intentMap.set('folio-selection', folioSelectionFunc);
  intentMap.set('greetings-followup-transaction', greetingsFollowupTransaction);
  intentMap.set('greetings-followup-transaction-query', greetingsFollowupTransaction);
  intentMap.set("transaction-intent-without-query", transactionWithoutQuery);
  intentMap.set("transaction-intent-without-query-yes", investMoreFunc);
  intentMap.set("greetings-followup-transaction-query-yes", investMoreFunc); 
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
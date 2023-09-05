///////////////////////////COMEÇO DO CÓDIGO//////////////////////////////

const express = require("express");
const app = express();
const { WebhookClient } = require("dialogflow-fulfillment");
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  })
);
  //FUNÇÃO TAMEZONE
  let date = new Date();
  let data = date.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false}); 

  //FUNÇÃO CRIAR ID 
  function uniqueID(){
  function chr4(){
    return Math.random().toString(16).slice(-4);
  }
  return chr4();
}

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.Text = "WEBHOOK - Fincionando no Glitch!";
});

app.post("/barbearia", function(request, response) {
  const agent = new WebhookClient({
    request: request,
    response: response
  });

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Welcome Intent - no", cadastro);
  intentMap.set("Default Welcome Intent - yes", pesquisa);
  intentMap.set("agendar", agendar);  
  agent.handleRequest(intentMap);

 //FUNÇÃO BOAS VINDAS
  function welcome(agent) {
    if (data >= 5 && data <= 11)
      agent.add(
        "Olá Bom dia, seja bem-vindo(a) ao atendimento automatizado da *Barbearia Reis*" +
          "\n" +
          "\n" +
          "Você já é nosso cliente?" +
          "\n" +
          "\n" +
          "👉🏼 SIM \n" +
          "👉🏼 NÃO"
      );
    else if (data >= 12 && data <= 17)
      agent.add(
        "Olá Boa tarde, seja bem-vindo(a) ao atendimento automatizado da *Barbearia Reis*" +
          "\n" +
          "\n" +
          "Você já é nosso cliente?" +
          "\n" +
          "\n" +
          "👉🏼 SIM \n" +
          "👉🏼 NÃO"
      );
    else
      agent.add(
        "Olá Boa noite, seja bem-vindo(a) ao atendimento automatizado da *Barbearia Reis*" +
          "\n" +
          "\n" +
          "Você já é nosso cliente?" +
          "\n" +
          "\n" +
          "👉🏼 SIM \n" +
          "👉🏼 NÃO"
      );
  }
  
  
  //AGENDAMENTO EM PLANILHA
  
  function agendar(agent) { 
    const { nome, profissional, dia, hora, telefone } = agent.parameters;
    const data = [
      {
        Nome: nome,
        Servico: profissional,
        Data: dia,
        Horario: hora,
        Telefone: telefone
      }
    ];    
    axios.post("SUA API AQUI?sheet=agenda", data);
    agent.add(`${nome}, o seu agendamento foi realizado com sucesso!\n` +
    "Digite *MENU* para ver as minhas Opções.");
  }
  
  
  //CADASTRO EM PLANILHA
  
  function cadastro(agent) {
    const { nome, telefone } = agent.parameters;
    const data = [
      {
        Nome: nome,
        Telefone: telefone,
        Id: uniqueID()
      }
    ];    
    axios.post("SUA API AQUI", data);
    agent.add(`${nome}, o seu cadastro realizado com sucesso!\n` +
    "Digite *MENU* para ver as minhas Opções.");
  }
  
  //PESQUISA EM PLANILHA

  function pesquisa(agent) {
    var telefone = request.body.queryResult.parameters.telefone;    
    return axios.get("SUA API AQUI").then(res => {
      res.data.map(coluna => {
        if (coluna.Telefone === telefone)
          response.json({
            fulfillmentText:
              "Seja bem Vindo de volta: " +
              "\n" +
              " *Sr.:* " +
              coluna.Nome +
              "\n" +
              " Digite *MENU* para ver as minhas Opções." 
          });
      });
    });
  }
 
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

////////////////////////////FIM DO CÓDIGO////////////////////////////////
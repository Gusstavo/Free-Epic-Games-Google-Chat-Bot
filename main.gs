/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  var games = getFreeGames()
  return putGamesCard(games)
}


/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat 
 */
function onAddToSpace(event) {
  var message = "";

  if (event.space.singleUserBotDm) {
    message = "Thanks for add me on your DM, " + event.user.displayName + "!";
  } else {
    message = "Thanks for add me! :) ";
  }
  return { "text": message };
}


/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}


/**
 * Create a card with free games informations.
 *
 * @param {Object} list with all free games
 */
function putGamesCard(games) {

  var widgets = []
  for (i in games){
    var start = Utilities.formatDate(new Date(games[i]["startDate"]), 'America/Sao_Paulo', "dd/MM/YYYY HH:mm");
    var end = Utilities.formatDate(new Date(games[i]["endDate"]), 'America/Sao_Paulo', "dd/MM/YYYY HH:mm");

    var widg = {
      "textParagraph": {
        "text": `${i != 0 ? '<br>' : ''}<b>${games[i]["title"]}</b><br>${games[i]["started"] ?
                `<font color=\"#0000ff\">Disponível até ${end}</font>` :
                `<font color=\"#ff0000\">Em Breve! ${start}</font>`}`
      },
      "buttons": [
        {
          "textButton": {
            "text": "CONFERIR GAME",
            "onClick": {
              "openLink": {
                "url": games[i]["url"]
              }
            }
          }
        }
      ]
    }
    widgets.push(widg)
  }

  return {
    "cards": [
      {
        "header": {
          "title": "<b>Lista de Jogos Grátis da Epic</b>",
          "imageUrl": "https://static-assets-prod.epicgames.com/epic-store/static/favicon.ico"
        },
        "sections": [
          {
            "widgets": widgets
          }
        ]
      }
    ]
  }
}


/**
 * Get all free games from epic games site.
 */
function getFreeGames() {
  const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR&allowCountries=BR"
  const response = JSON.parse(UrlFetchApp.fetch(url).getContentText())
  const elements = response["data"]["Catalog"]["searchStore"]["elements"]

  var gamesFree = []
  
  for(e in elements){
    const promotions = elements[e]["promotions"]
    var game = {
      "title": elements[e]["title"],
      "startDate": promotions["promotionalOffers"].length > 0 ?
        promotions["promotionalOffers"][0]["promotionalOffers"][0]["startDate"] :
        promotions["upcomingPromotionalOffers"][0]["promotionalOffers"][0]["startDate"],
      "endDate": promotions["promotionalOffers"].length > 0 ?
        promotions["promotionalOffers"][0]["promotionalOffers"][0]["endDate"] :
        promotions["upcomingPromotionalOffers"][0]["promotionalOffers"][0]["endDate"],
      "url": `https://www.epicgames.com/store/pt-BR/p/${elements[e]["productSlug"]}`
    }
    game["started"] = checkDate(game)
    gamesFree.push(game)
  } 
  //Logger.log(JSON.stringify(gamesFree,0,2))
  return gamesFree
}


/**
 * Check if today is on date game range.
 *
 * @param {Object} list with all free games
 */
function checkDate(game){
  const now = new Date()
  const bottomLimit = new Date(game["startDate"]);
  const upperLimit = new Date(game["endDate"]);
  var dateInPast = function(firstDate, secondDate) {
    if (firstDate <= secondDate) {
      return true;
    }
    return false;
  };
  if (dateInPast(bottomLimit, now) && !dateInPast(upperLimit, now))
    return true
  return false
}

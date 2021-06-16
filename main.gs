function GetFreeGames() {
  const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR&allowCountries=BR"
  const response = JSON.parse(UrlFetchApp.fetch(url).getContentText())
  const elements = response["data"]["Catalog"]["searchStore"]["elements"]

  var gamesFree = []
  
  for(e in elements){
    const promotions = elements[e]["promotions"]

    gamesFree.push({
      "title": elements[e]["title"],
      "startDate": promotions["promotionalOffers"].length > 0 ?
        promotions["promotionalOffers"][0]["promotionalOffers"][0]["startDate"] :
        promotions["upcomingPromotionalOffers"][0]["promotionalOffers"][0]["startDate"],
      "endDate": promotions["promotionalOffers"].length > 0 ?
        promotions["promotionalOffers"][0]["promotionalOffers"][0]["endDate"] :
        promotions["upcomingPromotionalOffers"][0]["promotionalOffers"][0]["endDate"],
    })
  }
  jlog(gamesFree)
}

function jlog(x){
  Logger.log(JSON.stringify(x,0,2))
}

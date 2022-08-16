// https://api.coingecko.com/api/v3/search/trending for top 7 trending
// https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false 100 crypto prices
// https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false search coin
// https://public-api.solscan.io/account/tokens?account=GpUU9dmv3rXhMXYxi391iyQM9sRPhkPfqoXxNZCcb6KT solana wallet info
// https://public-api.solscan.io/account/transactions?account=GpUU9dmv3rXhMXYxi391iyQM9sRPhkPfqoXxNZCcb6KT&limit=10 last solana transactions
let amount = 0;
let crypto = document.querySelector("#crypto");
let cryptoDiv = document.querySelector("#cryptoDiv");
let cryptoCardDiv = document.querySelector("#cryptoCardDiv");
let solWall = document.querySelector("#solWall");
let solWallDiv = document.querySelector("#solWallDiv");
let exchange = document.querySelector("#exchange");
document.querySelector(".searchBtn").addEventListener("click", () => {
  let searchAddress = document.querySelector(".searchInpt");
  fetchWallet(searchAddress.value);
});
document.body.onload = loadTrending();
async function loadTrending() {
  let res = await fetch("https://api.coingecko.com/api/v3/search/trending");
  let data = await res.json();
  let btcFetch = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  let btcPrice = await btcFetch.json();
  let top = document.querySelector("#top7");

  data.coins.forEach((coin) => {
    let col = document.createElement("div");
    let card = document.createElement("div");
    let img = document.createElement("img");
    let cardBody = document.createElement("div");
    let price = document.createElement("p");
    let name = document.createElement("p");
    col.className = "col";
    card.className = "card";
    img.className = "rounded-circle top mx-auto d-block";
    img.src = coin.item.small;
    cardBody.className = "card-body";
    price.innerHTML = `$${(coin.item.price_btc * btcPrice.bitcoin.usd).toFixed(
      6
    )}`;
    name.innerHTML = coin.item.symbol;
    top.append(col);
    col.append(card);
    card.append(img);
    card.append(cardBody);
    cardBody.append(name);
    cardBody.append(price);
  });
}
async function fetchWallet(address) {
  let tbody = document.querySelector("#tbody");
  let loader = document.querySelector(".loader");
  let table = document.querySelector(".table");
  let addressSol = document.querySelector("#addressSol");
  loader.style.display = "block";
  table.toggleAttribute("hidden");
  addressSol.innerHTML = address;
  let balance = document.querySelector("#balance");
  let res = await fetch(
    `https://public-api.solscan.io/account/tokens?account=${address}`
  );
  let data = await res.json();
  data = data.filter(
    (token) => token.tokenName && token.tokenAmount.uiAmount > 0
  );
  for await (token of data) {
    let tokenFetch = await fetch(
      `https://public-api.solscan.io/market/token/${token.tokenAddress}`
    );
    let tokenJSON = await tokenFetch.json();
    if (Math.round(token.tokenAmount.uiAmount * tokenJSON.priceUsdt)) {
      let tr = document.createElement("tr");
      let thAddress = document.createElement("th");
      let tdToken = document.createElement("td");
      let tdTokenBalance = document.createElement("td");
      let tdValue = document.createElement("td");
      let img = document.createElement("img");
      img.src = token.tokenIcon;
      img.style.width = "30px";
      img.style.height = "30px";
      thAddress.scope = "row";
      thAddress.innerHTML = token.tokenAddress;
      tdToken.innerHTML = token.tokenName;
      tdTokenBalance.innerHTML = token.tokenAmount.uiAmount;
      tbody.append(tr);
      tr.append(thAddress);
      tr.append(tdToken);
      tdToken.append(img);
      tr.append(tdTokenBalance);
      tr.append(tdValue);
      tdValue.innerHTML = `$${(
        token.tokenAmount.uiAmount * tokenJSON.priceUsdt
      ).toFixed(2)}`;
      amount += +(token.tokenAmount.uiAmount * tokenJSON.priceUsdt);
    }
  }
  loader.style.display = "none";
  table.toggleAttribute("hidden");
  balance.innerHTML = `$${amount.toFixed(2)}`;
}

async function fetchCryptoList() {
  let fetchList = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  let fetchListJSON = await fetchList.json();
  fetchListJSON.forEach((crypto) => {
    let divCard = document.createElement("div");
    let cardBody = document.createElement("div");
    let img = document.createElement("img");
    divCard.className = "card";
    cardBody.className = "card-body";
    img.src = crypto.image;
    img.style.width = "30px";
    img.style.height = "30px";
    cardBody.innerHTML = ` ${crypto.symbol} ${crypto.name} ${crypto.current_price} ${crypto.price_change_percentage_24h}`;
    cryptoCardDiv.append(divCard);
    divCard.append(cardBody);
    cardBody.append(img);
  });
}

crypto.addEventListener("click", () => {
  cryptoDiv.toggleAttribute("hidden");
  solWallDiv.style.display = "none";
});

import { getDb } from './db';
 
const API_URL = 'https://api.coincap.io/v2/assets?ids=';



const historical_template = {
    name : "",
    date : new Date(),
    market_cap: 0,
    price: 0,
    today: 0,
    week: 0,
}


async function fetchData() {
    try {
        //console.log('Fetching coins...');
        //Fetch all current coins from db
        const db = getDb();
        const collection = db.collection('currencies');

        const cursor = collection.find({}, { projection: { _id: 0, name: 1 } });
        // Fetch all documents
        const coins = await cursor.toArray();
        // Extract and convert names to lowercase
        const coinNames = coins.map(coin => coin.name.toLowerCase());
        //console.log('Coin names:', coinNames);
        
        //Create the string with all the coins separated by commas
        const coinsString = coinNames.join(',');
        //console.log('Coins string:', coinsString);

        //Fetch the data from the API
        const response = await fetch(API_URL + coinsString);
        const data = (await response.json()).data;
        //Create a new array from the data
        const newCoins = data.map((coins: any) => {
            let dataCoin = {... historical_template};
            dataCoin.name = coins.symbol;
            dataCoin.date = new Date();
            dataCoin.market_cap = coins.marketCapUsd;
            dataCoin.price = coins.priceUsd;
            dataCoin.today = coins.changePercent24Hr;
            return dataCoin;
        });

        //console.log('Coins fetched:', newCoins);

        //LOAD all the coins in the database 
        const historical_collection = db.collection('historical');
        const result = await historical_collection.insertMany(newCoins);

        if (result.insertedCount === newCoins.length) {
            console.log('Coins inserted:', result.insertedCount);
        } else {
            console.log('Error inserting coins:', result);
        }
        
    } catch (error) {
        console.log('Error fetching coins:', error);
    }
}

export default fetchData;
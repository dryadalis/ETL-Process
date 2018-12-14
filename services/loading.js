const queries = 'INSERT INTO Realestate(Title, Price, DataOfAddition, Location, Loaner, Size, NumberOfRooms) VALUES($1, $2, $3, $4, $5, $6, $7)';

 module.exports = {
  perform: async function(titles, prices, client, dataOfAddition, locations, loaner, size, numberOfRooms) {
    for (let i = 0; i < titles.length; i++) {
        try {
            await client.query(queries, [titles[i], prices[i], dataOfAddition[i], locations[i], loaner[i], size[i], numberOfRooms[i]]);
        } catch(e){}
    }
  }
};

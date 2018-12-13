const queries = 'INSERT INTO Realestate(Title, Price, Description) VALUES($1, $2, $3)';

 module.exports = {
  perform: async function(titles, prices, client, dataOfAddition, location, loaner, propertyKind, rooms, bathrooms, area, garage) {
    for (let i = 0; i < titles.length; i++) {
        try {
            await client.query(queries, [titles[i], prices[i], dataOfAddition[i], location[i], loaner[i], propertyKind[i], rooms[i], bathrooms[i], area[i], garage[i]])
        } catch(e){}
    }
  }
};

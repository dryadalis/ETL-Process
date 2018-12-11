const queries = 'INSERT INTO Realestate(Title, Price, Description) VALUES($1, $2, $3)';

 module.exports = {
  perform: async function(titles, prices, client, descs) {
    for (let i = 0; i < titles.length; i++) {
        try {
            await client.query(queries, [titles[i], prices[i], descs[i]])
        } catch(e){}
    }
  }
};

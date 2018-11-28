const queries = 'INSERT INTO Realestate(Title, Price) VALUES($1, $2)';

 module.exports = {
  perform: function(titles, prices, client) {
    for (let i = 0; i < titles.length; i++) {
        client.query(queries, [titles[i], prices[i]])
    }
  }
};

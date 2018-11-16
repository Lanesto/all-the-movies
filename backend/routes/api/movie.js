var oracledb = require('../../db/oracledb');

// Add TrailerURL
module.exports = function(req, res, next) {
    q = req.query;
    oracledb.bind("\
        SELECT MovieID, \
        MovieTitle, \
        TO_CHAR(ReleaseDate, 'YYYY-MM-DD'), \
        SUBSTR(TO_CHAR(PlayTime), 5, 5), \
        Genre, \
        Director, \
        Actors, \
        Description, \
        PosterIMG \
        FROM Movies \
        WHERE MovieID BETWEEN :0 AND :1", [
        parseInt(q.from, 10),
        parseInt(q.to, 10)
    ], function(err, result) {
        if (err) console.log(err);
        else {
            arr = [];
            rows = result.rows;
            for (var i in rows) {
                row = rows[i]; // drop ROWNUM
                let obj = {
                    MovieID: -1,
                    MovieTitle: '',
                    ReleaseDate: '',
                    PlayTime: '',
                    Genre: '',
                    Director: '',
                    Actors: '',
                    Description: '',
                    PosterIMG: '',
                }
                for (i in obj) obj[i] = row.shift();
                arr.push(obj);
            }
            console.log(`api/movie: fetched ${arr.length} row(s)`);
            res.json(arr);
        }
    });
};
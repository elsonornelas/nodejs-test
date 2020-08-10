
const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/acronym.json';
    const TOKEN = 'SERVER-TOKEN';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/acronym', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            const from = req.query && req.query.from;
            const limit = req.query && req.query.limit;
            const search = req.query && req.query.search;

            let dataResult = JSON.parse(data).slice();

            if (dataResult.length >= from) dataResult = dataResult.slice(from);
            if (search) dataResult = dataResult.filter(txt => 
                Object.values(txt)[0].includes(search)
            )
            if (limit > 0) {
                if (dataResult.length > limit) res.setHeader('More', 'There are more results');
                dataResult = dataResult.slice(0, limit);
            }
            if (search) dataResult = dataResult.filter(txt => 
                Object.values(txt)[0].includes(search)
            )

            res.send(dataResult);
        });
    });

    // GET
    app.get('/acronym/:id', (req, res) => {

        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            const userId = req.params["id"];
            const acronymData = JSON.parse(data).filter(txt => Object.keys(txt)[0] === userId);
            const result = acronymData.length > 0 ? `result: ${Object.values(acronymData[0])}` : 'No result'
            res.status(200).send(result);
        },
            true);
    });

     // RANDOM
    app.get('/random/:count', (req, res) => {
        const randomResult = (myArray,nb_picks) => {
            const newArray = myArray.map((item, i) => {
                return { ...item, index: i };
            });

            for (let i = newArray.length-1; i > 1  ; i--)
            {
                var r = Math.floor(Math.random()*i);
                var t = newArray[i];
                newArray[i] = newArray[r];
                newArray[r] = t;
            }
            const compareArray = newArray.map((n, i) => i > 0 ? newArray[i].index-newArray[i-1].index : n.index);
            const diffArray = compareArray.slice(0,nb_picks).filter(n => n < 2 && n > -2);
            if (diffArray.length > 0) {
                console.log('shuffled');
                randomResult(myArray,nb_picks);
            } 

            return newArray.slice(0,nb_picks);
        }

        const count = req.params["count"];

        readFile(data => {
            res.status(200).send(
                JSON.stringify(randomResult(data, count))
            );
        },
        true);

    });

    // CREATE
    app.post('/acronym', (req, res) => {

        readFile(data => {
            const newUserId = Object.keys(data).length + 1;

            // add the new user
            data.push(req.body);
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`new acronym added`);
            });
        },
            true);
    });


    // UPDATE
    app.put('/acronym/:id', (req, res) => {

        if (req.header('token') !== TOKEN) {
            res.status(200).send('Not authroized');
        } else {
            readFile(data => {

                // add the new user
                const userId = req.params["id"];
                const dataResult = data.map(txt => Object.keys(txt)[0] === userId ? { [userId]: Object.values(req.body)[0] } : txt);
    
                writeFile(JSON.stringify(dataResult, null, 2), () => {
                    res.status(200).send(`acronym id:${userId} updated`);
                });
            },
                true);
        }
    });


    // DELETE
    app.delete('/acronym/:id', (req, res) => {
        if (req.header('token') !== TOKEN) {
            res.status(200).send('Not authroized');
        } else {
            readFile(data => {

                // add the new user
                const userId = req.params["id"];
                const dataResult = data.filter(txt => Object.keys(txt)[0] !== userId );
    
                writeFile(JSON.stringify(dataResult, null, 2), () => {
                    res.status(200).send(`acronym id:${userId} removed`);
                });
            },
                true);
        }
    });
};

module.exports = userRoutes;
import express from 'express';
import {validationResult, checkSchema} from 'express-validator';
import {PokeValidationSchema} from './lib/utils/validationSchemas.js';
import pool from './db.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

const PORT = 3000;


/* function existenceValidator(req,res,next)
{
    const { params : {id}} = req;
    const foundId = pool.query('SELECT * FROM POKEMON WHERE ID = ?',[id]);
    
    if (foundIndex == -1)
    {
        return res.status(404).json({message: "Pokeboy not found."});
    }
        
    req.foundIndex = foundIndex;
        
    next();
} */


function sort(req,res,next)
{
    const sortedPokemon = [...pokemon].sort((a,b) => a.name.localeCompare(b.name));
    res.obj = sortedPokemon;

    next();
}

app.get('/', (req, res) => {
    return res.send({message:"Welcome to my website."});
})

app.get('/students', (req,res) => {
    res.send({id:"230962234", name : "Trehaan Parekh", age : "20"});
})

/* app.get('/pokemon/:name', existenceValidator, (req,res) => {

    const poke = pokemon[req.foundIndex];
    return res.send(`You chose ${poke.name} of ${poke.type} type.`);
}) */

app.get('/pokemon', async (req,res) => { 

    const { query : {x:filter,y:value} } = req;
    let pokemon;
    if (filter && value && ["name","type"].includes(filter))
    {
        [pokemon] = await pool.query(`SELECT * FROM POKEMON WHERE ${filter} = ?;`,[value]);
    }
    else
    {
        [pokemon] = await pool.query('SELECT * FROM POKEMON;');
    }
    return res.send(pokemon);
})

app.post('/pokemon',checkSchema(PokeValidationSchema),async (req,res) => {
    console.log("Hello");
    const { body, body : {name,type} } = req;
    const result = validationResult(req);
    if (!result.isEmpty())
        return res.status(400).json({errors : result.array().map(error => error.msg)});

    const [data] = await pool.query('INSERT INTO POKEMON(NAME,TYPE) VALUES(?,?);',[name,type]);
    const new_data = body;
    new_data.id = data.insertId;
    return res.send(new_data);
})

app.patch('/pokemon/:id',checkSchema(PokeValidationSchema), async (req,res) => {
    console.log(req.params.id);
    console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty())
        return res.status(400).json({errors : result.array().map(error => error.msg)});

    const {params : {id},body : {name,type}} = req;

    const [old_pokes] = await pool.query('SELECT name,type FROM POKEMON WHERE ID = ?',[id]);
    const old_poke = old_pokes[0];
    await pool.query('UPDATE POKEMON SET NAME = ?, TYPE = ? WHERE ID = ?',[name,type,id]);
    res.status(200).json({"old_poke":old_poke, "new_poke":req.body}); 
})

app.delete('/pokemon/:id',async (req,res) => {

    const {params : {id}} = req;

    await pool.query('DELETE FROM POKEMON WHERE ID = ?',[id]);
    return res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
})
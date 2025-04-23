import pool from '../../db.js'

function typeValidator(value)
{
    const types = ["Fire","Water","Grass","Ground","Electric","Rock","Fairy","Steel","Dragon","Ice","Poison","Bug","Ghost","Dark","Flying","Normal","Psychic","Fighting"];
    
    const typeParts = value.split("/",2);
    for (const type of typeParts)
    {
        if (!types.includes(type))
            return false;
    }

    return true;
}

async function uniquenessValidator(value,req)
{
    const { body : {type}} = req;
    const [pokemon] = await pool.query('SELECT id FROM POKEMON WHERE NAME = ? AND TYPE = ? LIMIT 1;',[value,type]);
    if (pokemon.length === 0)
        return true;
    else if (req.method === 'POST' || (req.method === 'PATCH' && pokemon[0].id !== parseInt(req.params.id)))
        throw new Error("Pokeboy already exists");
}

export const PokeValidationSchema = {
    name : {
        in : ['body'],
        isAlpha : {
            errorMessage : "Poke name must be a valid alphabetical string"
        },
        custom : {
            options : (value, {req}) => uniquenessValidator(value,req),
            errorMessage : "Pokeboy already exists"
        }
    },

    type : {
        in : ['body'],
        custom : {
            options : (value) => typeValidator(value),
            errorMessage : "Invalid Poke typing"
            }
        }
    }


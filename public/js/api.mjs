const url = "http://localhost:3000/pokemon";

export function getPokeApi()
{
    return fetch(url);
}

export function postPokeApi(poke)
{
    return fetch(url, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(poke)
    })
}

export function patchPokeApi(id,poke)
{
    console.log(id)
    console.log(poke);
    
    return fetch(`${url}/${id}`, {
        method : "PATCH",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(poke)
    });
}

export function deletePokeApi(id)
{
    return fetch(`${url}/${id}`, {
        method: "DELETE"
    });
}
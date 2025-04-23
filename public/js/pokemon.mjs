import {handleErrors, clearErrorMessage, switchToInput, switchToLabel } from './utils.mjs';
import {postPokeApi, patchPokeApi, deletePokeApi} from './api.mjs';

export function addPokeLi(poke)
{
    poke.li = document.createElement("li");

    const {li} = poke;

    li.nameTag = document.createElement("label");
    li.nameTag.className = "nameTag";
    li.nameTag.textContent = "Name : ";

    li.nameTag.label = document.createElement("label");
    li.nameTag.label.textContent = poke.name;
    
    li.nameTag.label.style.display = "inline-block";

    li.nameTag.input = document.createElement("input");
    li.nameTag.input.style.display = "none";

    li.nameTag.appendChild(li.nameTag.label);
    li.nameTag.appendChild(li.nameTag.input);


    li.typeTag = document.createElement("label");
    li.typeTag.className = "typeTag";
    li.typeTag.textContent = "Type : ";

    li.typeTag.label = document.createElement("label");
    li.typeTag.label.textContent = poke.type;
    li.typeTag.label.style.display = "inline-block";

    li.typeTag.input = document.createElement("input");
    li.typeTag.input.style.display = "none";

    li.typeTag.appendChild(li.typeTag.label);
    li.typeTag.appendChild(li.typeTag.input);

    li.appendChild(li.nameTag);
    li.appendChild(li.typeTag);

    li.editButton = document.createElement("button");
    li.editButton.className = "pokeEditor";
    li.editButton.innerText = "Edit";
    li.editButton.addEventListener("click", () => editPokemon(poke));
    
    li.delButton = document.createElement("button");
    li.delButton.innerText = "Delete";
    li.delButton.className = "pokeDeleter";
    li.delButton.addEventListener("click", () => deletePokemon(poke));

    li.errors = [];

    li.appendChild(li.editButton);
    li.appendChild(li.delButton);
    
    document.getElementById("pokeList").appendChild(li);
}

export function addPokemon()
{
    const name = document.getElementById("adderName").value;
    const type = document.getElementById("adderType").value;

    if (!name || !type)
        return;

    const poke = { "name" : name, "type" : type };

    clearErrorMessage(document.getElementById("AdderErrors"));

    postPokeApi(poke)
    .then(res => {

        if (res.status === 400) 
        {    
            return res.json().then(data => {

                const adderErrors = document.getElementById("AdderErrors");
                handleErrors(data,adderErrors);
            });
        }

        else if (res.ok)
        {
            res.json().then(data => {

                addPokeLi(data);
                console.log("Added Pokemon : ", name);
        
            }).catch(error => console.error("Error : ",error));

            
        }
    
    }).catch(error => console.error("Error : ",error));
}


function editPokemon(poke)
{
    const { li, li : {nameTag, typeTag, editButton} } = poke;

    if (editButton.innerText === "Edit")
    {
        switchToInput(nameTag);
        switchToInput(typeTag);

        editButton.innerText = "Done";
    }

    else
    {
        clearErrorMessage(li);

        const new_poke = {name : nameTag.input.value, type : typeTag.input.value};

        patchPokeApi(poke.id, new_poke)
        .then( res => {

            if (res.ok)
            { 
                switchToLabel(nameTag);
                switchToLabel(typeTag);

                res.json().then( data => {
                    console.log("Edited Pokemon \n");
                    console.log("OLD : ", data.old_poke);
                    console.log("NEW : ", data.new_poke);
                })
                
                editButton.innerText = "Edit";
            }

            else 
            {
                res.json().then( data => {
                    
                    handleErrors(data,li);
                })
            }
        })
        .catch(err => console.error("Error : ", err ));

    }
}


function deletePokemon(poke)
{
    const {id,name,li} = poke;

    deletePokeApi(id)
    .then(res => {
        if (res.status === 404) {
            return res.json().then(data => {
                document.getElementById("NotFoundMessage").innerHTML = data.message;
            });
        } else if (res.ok) {
            document.getElementById("pokeList").removeChild(li);
            console.log(`Deleted Pokémon: ${name}`);
        }
    })
    .catch(error => console.error("Error:", error));
}  
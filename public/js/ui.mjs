import { getPokeApi } from './api.mjs';
import { addPokeLi, addPokemon } from './pokemon.mjs';

const slider = document.getElementById("band");

const pikachu = document.createElement("img");
pikachu.src = "https://www.freeiconspng.com/thumbs/pikachu-transparent/pikachu-transparent-hd-1.png";
pikachu.id = "psyduck";

const box = document.getElementById("container");
const pb = document.getElementById("pokeball");

export function setupUI()
{
    document.getElementById("AdderErrors").errors = [];
    populatePokeList();
}

export function setupEventListeners()
{
    slider.addEventListener("input", () => {

        if (parseInt(slider.value) === 100)
        {
            box.removeChild(pb);
            box.appendChild(pikachu);
            console.log("Max reached");
        }

        else
        {
            if (box.contains(pikachu))
            {
                box.removeChild(pikachu);
                box.appendChild(pb);
            }
            pb.style.transform = `scale(${slider.value/50}) rotate(${slider.value * 3.6 - 180}deg)`;
        }
    })

    document.getElementById("loadBtn").addEventListener("click", displayPokemon);
    document.getElementById("addBtn").addEventListener("click", addPokemon);
}

function populatePokeList()
{
    getPokeApi().then(res => res.json()).then(data => {

        const list = document.getElementById("pokeList");
        list.innerHTML = "";
        list.style.display = "none";
        data.forEach(poke => {
            addPokeLi(poke);
        });

    }).catch(error => console.error("Error fetching pokemon.",error));
}


function displayPokemon()
{
    const button = document.getElementById("loadBtn");
    const list = document.getElementById("pokeList");

    if (button.innerText === 'Get Pokemon')
    {
        list.style.display = 'block';
        button.innerText = 'Hide Pokemon';
    }
    else
    {
        list.style.display = 'none';
        button.innerText = 'Get Pokemon';
    }
    
}


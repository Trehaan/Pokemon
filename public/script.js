const url = "http://localhost:3000/pokemon";
let list;
document.getElementById("AdderErrors").errors = [];

function addPokeLi(poke)
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

function clearErrorMessage(node)
{
    console.log("Error list : ",node.errors);
    console.log("Child Nodes : ",node.childNodes);
    node.errors.forEach(errorLabel => {
        node.removeChild(errorLabel);
    });
    node.errors = [];
}

function switchToInput(tag)
{
    tag.label.style.display = "none";
    tag.input.defaultValue = tag.label.textContent;
    tag.input.style.display = "inline-block";
}

function switchToLabel(tag)
{
    tag.input.style.display = "none";
    tag.label.textContent = tag.input.value;
    tag.label.style.display = "inline-block";
}


fetch(url).then(res => res.json()).then(data => {

    list = document.getElementById("pokeList");
    list.innerHTML = "";
    list.style.display = "none";
    data.forEach(poke => {
        addPokeLi(poke);
    });

}).catch(error => console.error("Error fetching pokemon.",error));

const slider = document.getElementById("band");

const pikachu = document.createElement("img");
pikachu.src = "https://www.freeiconspng.com/thumbs/pikachu-transparent/pikachu-transparent-hd-1.png";
pikachu.id = "psyduck";

const box = document.getElementById("container");
const pb = document.getElementById("pokeball");

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


function fetchPokemon()
{
    const button = document.getElementById("loadBtn");

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

function addPokemon()
{
    const name = document.getElementById("adderName").value;
    const type = document.getElementById("adderType").value;

    if (!name || !type)
        return;

    const poke = { "name" : name, "type" : type };

    clearErrorMessage(document.getElementById("AdderErrors"));

    fetch(url, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(poke)
    })
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

/* function deletePokemonByText() 
{
    const name = document.getElementById("deleterName").value;
    deletePokemon(name);
} */

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

        fetch(`${url}/${poke.id}`, {
            method : "PATCH",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({name : nameTag.input.value, type : typeTag.input.value})
        })
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

function handleErrors(data,node)
{
    data.errors.forEach(error => {
        const errorLabel = document.createElement("label");
        errorLabel.className = "errorLabel";
        errorLabel.innerText = error;
        node.errors.push(errorLabel);
        node.appendChild(errorLabel);
    });
}


function deletePokemon(poke)
{
    const {id,name,li} = poke;

    fetch(`${url}/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (res.status === 404) {
            return res.json().then(data => {
                document.getElementById("NotFoundMessage").innerHTML = data.message;
            });
        } else if (res.ok) {
            list.removeChild(li);
            console.log(`Deleted Pokémon: ${name}`);
        }
    })
    .catch(error => console.error("Error:", error));
}   

/* document.querySelectorAll("*").forEach(ele => {
    ele.addEventListener("click", () => {
         clearErrorMessage(document.getElementById("AdderErrors"));
        })
}) */
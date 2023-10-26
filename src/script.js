let pokemons = [];
let pokemonChain = [];
let myPokemon = [];


let candies = 100;
let pokeball = 100;
let pokemonOwnedIndex = [];
let evolvedPokemonIndex = [];


export const candiesUpdater = () => { // aggiornamento temporizzato di caramelle e pokeball
    candies += 1;
    document.getElementById("candies").textContent = candies;
    localStorage.setItem("candies", candies);
}
export const pokeballUpdater = () => {
    pokeball += 1;
    document.getElementById("pokeball").textContent = pokeball;
    localStorage.setItem("pokeball", pokeball);
}

export const checkAlreadyOwnedPokemon = () => {
    for (let j = 0; j < pokemonOwnedIndex.length; j++) {
        
        if ( pokemonOwnedIndex[j] !== "") {
            myPokemon.push(pokemons[pokemonOwnedIndex[j]]);
            pokemons[pokemonOwnedIndex[j]] = null;
        }
    }
    for (let j = 0; j < evolvedPokemonIndex.length; j++) {
       
        if ( evolvedPokemonIndex[j] !== "") {
            pokemons[evolvedPokemonIndex[j] - 1] = null;
        }
    }
    
}

export const displayPokemon = async () => {
    /* DA IMPLEMENTARE*/

    checkAlreadyOwnedPokemon()
    const div = document.getElementById("pokemon");

    while (div.firstChild) { // pullisce lo schermo per updatare i pokemon
        div.removeChild(div.firstChild);
    }

    for (let i = 0; i < 522; i++) { // prende tutte le evolution chains
        if (i !== 209 && i !== 221 && i !== 224 && i !== 226 && i !== 230 && i !== 237 && i !== 250 && i !== 225) {
            const data = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${i + 1}/`);
            const pokeJson = await data.json();
            // console.log(pokeJson)
            // console.log(i)
            if (data.status === 200) {
                pokemonChain.push(pokeJson);
            }
        }
    }


    // TODO implementare forEach
    for (let i = 0; i < 1010; i++) { // mostra i pokemon
        if (pokemons[i] === null) continue;
        for (let j = 0; j < pokemonChain.length; j++) { // controlla che il pokemon appartenga a quelli base

            if (pokemonChain[j].chain.species.name === pokemons[i].name) {


                const pokemonDiv = document.createElement("div"); // card
                const pokemonContent = document.createElement('div'); // contenuto card

                pokemonDiv.className = "pokemonContainer";
                pokemonContent.className = "card-inner";

                const pokemonCardFront = document.createElement("div"); // front
                const pokemonCardBack = document.createElement("div"); // back

                pokemonCardFront.className = "front";
                pokemonCardBack.className = "back";

                let pokemonName = document.createElement("h5"); // nome pokemon

                pokemonName.className = "pokemonName";
                pokemonName.textContent = pokemons[i].name + "  #" + (i + 1);
                pokemonCardFront.appendChild(pokemonName);

                // recupera l'immagine
                const imageResponse = await fetch(`https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`);
                if (imageResponse.status !== 200) {
                    //console.log(i)
                    throw new Error('Errore nella richiesta HTTP');
                }

                const bleb = await imageResponse.blob();

                const image = document.createElement("img"); // immagine
                image.className = "pokemonImage";
                image.src = URL.createObjectURL(bleb);
                pokemonCardFront.appendChild(image);

                const imgPokemon = document.createElement("img"); // logo pokemon sul retro della card
                imgPokemon.src = "https://assets.pokemon.com/assets/cms2-it-it/img/misc/gus/buttons/logo-pokemon-79x45.png";
                pokemonCardBack.appendChild(imgPokemon);

                // recupero informazioni aggiuntive per il pokemon
                const pokemonInformationsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`);

                if (pokemonInformationsResponse.status !== 200) {
                    throw new Error('Errore nella richiesta API');
                }

                const pokemonInformationJSON = await pokemonInformationsResponse.json();

                const abilityContainer = document.createElement("div"); // div abilità pokemon
                abilityContainer.className = "abilityContainer";

                abilityContainer.appendChild(document.createElement("hr"));

                pokemonInformationJSON.abilities.forEach(element => {
                    const pokemonBackcardText = document.createElement("h3");
                    pokemonBackcardText.textContent = element.ability.name;
                    abilityContainer.appendChild(pokemonBackcardText);
                });

                abilityContainer.appendChild(document.createElement("hr"));
                pokemonCardBack.appendChild(abilityContainer);

                const catchButton = document.createElement("button"); // bottone catch
                catchButton.className = "catchButton";
                catchButton.innerHTML = "Catch";

                catchButton.addEventListener("click", function () { //funzione al catch
                    const random = Math.random();
                    pokeball -= 1;

                    if (random >= 0.5) { // condizioni di cattura
                        alert("Pokemon catturato!");
                        myPokemon.push(pokemons[i]);
                        pokemons[i] = null;
                        pokemonOwnedIndex.push(i);
                        displayPokemon();
                    } else {
                        alert("Il pokemon è scappato")
                        document.getElementById("pokeball").textContent = pokeball;
                    }

                    localStorage.setItem("pokemonIndex", pokemonOwnedIndex);
                });

                pokemonCardBack.appendChild(catchButton);
                pokemonContent.appendChild(pokemonCardFront);
                pokemonContent.appendChild(pokemonCardBack);
                pokemonDiv.appendChild(pokemonContent);

                div.appendChild(pokemonDiv);
                j = pokemonChain.length; // stoppa il for
            }
        }
    }
}

const getAllPokemons = async () => {
    // recupera tutti i pokemon
    const allPokemons = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0.');

    if (allPokemons.status !== 200) {
        throw new Error('Errore nella richiesta HTTP');
    }

    if (localStorage.getItem("pokemonIndex") !== null) {
        let string = localStorage.getItem("pokemonIndex");
        pokemonOwnedIndex = string.split(",");
    } else {
        localStorage.setItem("pokemonIndex", pokemonOwnedIndex)
    }
    const myJson = await allPokemons.json();

    pokemons = Array.from(myJson.results);

    if (localStorage.getItem("candies") === null ||
        localStorage.getItem("pokeball") === null ||
        isNaN(localStorage.getItem("candies")) ||
        isNaN(localStorage.getItem("pokeball"))) {
        candies = 100;
        pokeball = 100;
        localStorage.setItem("candies", candies);
        localStorage.setItem("pokeball", pokeball);
    } else {
        candies = parseInt(localStorage.getItem("candies"));
        pokeball = parseInt(localStorage.getItem("pokeball"));
    }

    document.getElementById("candies").textContent = candies; //inizializza il testo di caramelle e pokemon
    setInterval(candiesUpdater, 1000);

    document.getElementById("pokeball").textContent = pokeball;
    setInterval(pokeballUpdater, 10000);

    pokemons.forEach((pokemon, idx) => {
        localStorage.setItem(idx, JSON.stringify(pokemon));
    });



    await displayPokemon();
}

const initializeVariables = () => {
    if (localStorage.getItem("pokemonIndex") !== null) {
        let string = localStorage.getItem("pokemonIndex");
        pokemonOwnedIndex = string.split(",");
    } else {
        localStorage.setItem("pokemonIndex", pokemonOwnedIndex);
    }

    if (localStorage.getItem("evolvedIndex") !== null) {
        let string = localStorage.getItem("evolvedIndex");
        evolvedPokemonIndex = string.split(",");
    } else {
        localStorage.setItem("evolvedIndex", evolvedPokemonIndex)
    }

    if (localStorage.getItem("candies") === null ||
        localStorage.getItem("pokeball") === null ||
        isNaN(localStorage.getItem("candies")) ||
        isNaN(localStorage.getItem("pokeball"))
    ) {
        candies = 100;
        pokeball = 100;
        localStorage.setItem("candies", candies);
        localStorage.setItem("pokeball", pokeball);
    } else {
        candies = parseInt(localStorage.getItem("candies"));
        pokeball = parseInt(localStorage.getItem("pokeball"));
    }

    if (localStorage.getItem("0") === null) {
        getAllPokemons();
    } else {
        for (let i = 0; i < 1272; i++) {
            pokemons.push(JSON.parse(localStorage.getItem(i.toString())));
        }
        document.getElementById("candies").textContent = candies; //inizializza il testo di caramelle e pokemon
        setInterval(candiesUpdater, 1000);

        document.getElementById("pokeball").textContent = pokeball;
        setInterval(pokeballUpdater, 10000);
        checkAlreadyOwnedPokemon();
        //console.log(pokemons)
        displayPokemon();
    }

}


/*for (let i = 0; i < 1272; i++) {
    localStorage.removeItem(i);
}

localStorage.removeItem("pokemonIndex")

localStorage.removeItem("candies")
localStorage.removeItem("pokeball")*/

await initializeVariables()

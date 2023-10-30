let pokemons = [];
let pokemonChain = [];
let myPokemon = [];


let candies = 100;
let pokeball = 100;
let pokemonOwnedIndex = [];
let listOfEvolutioins = [];
let evolvedPokemonIndex = [];

class evolutionElement {
    constructor(base, fase1, fase2) {
        this.base = base;
        this.fase1 = fase1;
        this.fase2 = fase2;
    }
}

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


function initializeVariables() {
    if (localStorage.getItem("pokemonIndex") !== null) {
        let string = localStorage.getItem("pokemonIndex");
        pokemonOwnedIndex = string.split(",");
    } else {
        localStorage.setItem("pokemonIndex", pokemonOwnedIndex)
    }

    if (localStorage.getItem("evolvedIndex") !== null) {
        let string = localStorage.getItem("evolvedIndex");
        evolvedPokemonIndex = string.split(",");
    } else {
        localStorage.setItem("evolvedIndex", evolvedPokemonIndex)
    }

    if (localStorage.getItem("candies") == null || localStorage.getItem("pokeball") == null || localStorage.getItem("candies") == NaN || localStorage.getItem("pokeball") == NaN) {
        candies = 100;
        pokeball = 100;
        localStorage.setItem("candies", candies);
        localStorage.setItem("pokeball", pokeball);
    } else {
        candies = parseInt(localStorage.getItem("candies"));
        pokeball = parseInt(localStorage.getItem("pokeball"));
    }

    if (localStorage.getItem("0") == null) {
        getAllPokemons();
    } else {
        for (let i = 0; i < 1272; i++) {
            console.log(i)
            pokemons.push(JSON.parse(localStorage.getItem(i)));
        }
        document.getElementById("candies").textContent = candies; //inizializza il testo di caramelle e pokemon
        setInterval(candiesUpdater, 1000);

        document.getElementById("pokeball").textContent = pokeball;
        setInterval(pokeballUpdater, 10000);
        //console.log(pokemons)
        displayPokemon();
    }
}

const displayPokemon = async () => {
    /* DA IMPLEMENTARE*/

    checkOwnedPokemon();

    const div = document.getElementById("pokemon");

    while (div.firstChild) { // pullisce lo schermo per updatare i pokemon
        div.removeChild(div.firstChild);
    }

    for (let i = 0; i < 522; i++) { // prende tutte le evolution chains
        if (i !== 209 && i !== 221 && i !== 224 && i !== 226 && i !== 230 && i !== 237 && i !== 250 && i !== 225) {
            const data = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${i + 1}/`);
            const pokeJson = await data.json();
            if (data.status === 200) {
                pokemonChain.push(pokeJson);
            }
        }
    }

    createListEvolutioins()


    // TODO implementare forEach

    for (let i = 0; i < myPokemon.length; i++) { // mostra i pokemon
        const pokemonDiv = document.createElement("div"); // card
        const pokemonContent = document.createElement('div'); // contenuto card

        pokemonDiv.className = "pokemonContainer";
        pokemonContent.className = "card-inner";

        const pokemonCardFront = document.createElement("div"); // front
        const pokemonCardBack = document.createElement("div"); // back

        pokemonCardFront.className = "front";
        pokemonCardBack.className = "back";

        let pokemonName = document.createElement("h5"); // nome pokemon
        let indexImg = Number.parseInt(pokemonOwnedIndex[i + 1]) + 1
        pokemonName.className = "pokemonName";
        pokemonName.textContent = myPokemon[i].name + "  #" + (indexImg);
        pokemonCardFront.appendChild(pokemonName);

        // recupera l'immagine
        const imageResponse = await fetch(`https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${indexImg}.png`);
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

        const evolveButton = document.createElement("button"); // bottone catch
        evolveButton.className = "evolveButton";
        evolveButton.innerHTML = "Evolve";


        /* todo IMPLEMENTARE IL BOTTONE PER FARE EVOLVERE */
        evolveButton.addEventListener("click", function () { //funzione al catch

            const index = Number.parseInt(myPokemon[i].url.split("/")[6]);
            for (let j = 0; j < listOfEvolutioins.length; j++) {
                let element = listOfEvolutioins[j];

                if (index == element.base && element.fase1 == null) {
                    console.log("Il pokemon non si può evolvere")
                    alert("Il pokemon non si può evolvere");
                    j = listOfEvolutioins.length;
                }

                if (index == element.base && element.fase1 != null) {
                    if ((candies - 100) >= 0) {
                        pokemonOwnedIndex[i + 1] = element.fase1 - 1;
                        evolvedPokemonIndex.push(index);
                        localStorage.setItem("pokemonIndex", pokemonOwnedIndex);
                        candies -= 100;
                        checkOwnedPokemon();
                        displayPokemon();
                    } else {
                        alert("Non hai abbastanza caramelle");
                    }

                    j = listOfEvolutioins.length;
                } else if (index == element.fase1 && element.fase2 != null) {
                    if ((candies - 200) >= 0){
                        pokemonOwnedIndex[i + 1] = element.fase2 - 1;
                        localStorage.setItem("pokemonIndex", pokemonOwnedIndex);
                        evolvedPokemonIndex.push(index);
                        localStorage.setItem("evolvedIndex", evolvedPokemonIndex);
                        candies -= 200;
                        checkOwnedPokemon();
                        displayPokemon();
                    } else {
                        alert("Non hai abbastanza caramelle");
                    }
                   
                    j = listOfEvolutioins.length;
                } else if (index == element.fase2) {
                    alert("Il pokemon non si può evolvere");
                    j = listOfEvolutioins.length;
                } else if (index == element.fase1 && element.fase2 == null){
                    alert("Il pokemon non si può evolvere");
                    j = listOfEvolutioins.length;
                }

            }


        });

        pokemonCardBack.appendChild(evolveButton);
        pokemonContent.appendChild(pokemonCardFront);
        pokemonContent.appendChild(pokemonCardBack);
        pokemonDiv.appendChild(pokemonContent);

        div.appendChild(pokemonDiv);
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

    if (localStorage.getItem("candies") == null || localStorage.getItem("pokeball") == null || localStorage.getItem("candies") == NaN || localStorage.getItem("pokeball") == NaN) {
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

function checkOwnedPokemon() {
    myPokemon = [];
    pokemonOwnedIndex.forEach((idx) => {
        if (idx != "") {
            myPokemon.push(pokemons[idx]);
        }

    })
}

function createListEvolutioins() {
    pokemonChain.forEach(pokemon => {
        if (pokemon.chain.evolves_to[0] != null && pokemon.chain.evolves_to[0].evolves_to[0] != null) {
            const index0 = Number.parseInt(pokemon.chain.species.url.split("/")[6]);
            const index1 = Number.parseInt(pokemon.chain.evolves_to[0].species.url.split("/")[6]);
            const index2 = Number.parseInt(pokemon.chain.evolves_to[0].evolves_to[0].species.url.split("/")[6]);
            const element = new evolutionElement(index0, index1, index2)
            listOfEvolutioins.push(element);
        } else if (pokemon.chain.evolves_to[0] != null && pokemon.chain.evolves_to[0].evolves_to[0] == null) {
            const index0 = Number.parseInt(pokemon.chain.species.url.split("/")[6]);
            const index1 = Number.parseInt(pokemon.chain.evolves_to[0].species.url.split("/")[6]);
            const element = new evolutionElement(index0, index1, null)
            listOfEvolutioins.push(element);
        } else {
            const index0 = Number.parseInt(pokemon.chain.species.url.split("/")[6]);
            const element = new evolutionElement(index0, null, null)
            listOfEvolutioins.push(element);
        }
    })
}

/*for (let i = 0; i < 1272; i++) {
    localStorage.removeItem(i);
}

localStorage.removeItem("pokemonIndex")

localStorage.removeItem("candies")
localStorage.removeItem("pokeball")
localStorage.removeItem("evolvedIndex")*/


initializeVariables();
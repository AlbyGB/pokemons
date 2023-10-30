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

        if (pokemonOwnedIndex[j] !== "") {
            myPokemon.push(pokemons[pokemonOwnedIndex[j]]);
            pokemons[pokemonOwnedIndex[j]] = null;
        }
    }
    for (let j = 0; j < evolvedPokemonIndex.length; j++) {

        if (evolvedPokemonIndex[j] !== "") {
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
            // console.log(i)
            if (data.status === 200) {
                pokemonChain.push(pokeJson);
            }
        }
    }

    for (let k = 0; k < pokemonChain.length; k++) {
        const index = Number.parseInt(pokemonChain[k].chain.species.url.split("/")[6]);
        if (pokemons[index - 1] != null) {
            let j = index - 1;
            const pokemonDiv = document.createElement("div"); // card
            const pokemonContent = document.createElement('div'); // contenuto card

            pokemonDiv.className = "pokemonContainer";
            pokemonContent.className = "card-inner";

            const pokemonCardFront = document.createElement("div"); // front
            const pokemonCardBack = document.createElement("div"); // back

            pokemonCardFront.className = "front";
            pokemonCardBack.className = "back";

            let pokemonName = document.createElement("div"); // nome pokemon
            let p = document.createElement("h3");
            pokemonName.className = "pokemonName";
            p.textContent = pokemons[j].name + "  #" + (j + 1);
            pokemonName.appendChild(p);
            pokemonCardFront.appendChild(pokemonName);

            // recupera l'immagine
            /*const imageResponse = await fetch(`https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${j + 1}.png`);
            if (imageResponse.status !== 200) {
                //console.log(i)
                throw new Error('Errore nella richiesta HTTP');
            }

            const bleb = await imageResponse.blob();
            image.src = URL.createObjectURL(bleb);*/

            const image = document.createElement("img"); // immagine
            image.className = "pokemonImage";
            image.src = `https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${j + 1}.png`
            pokemonCardFront.appendChild(image);

            const imgPokemon = document.createElement("img"); // logo pokemon sul retro della card
            imgPokemon.src = "https://assets.pokemon.com/assets/cms2-it-it/img/misc/gus/buttons/logo-pokemon-79x45.png";
            pokemonCardBack.appendChild(imgPokemon);

            // recupero informazioni aggiuntive per il pokemon
            const pokemonInformationsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${j + 1}/`);

            if (pokemonInformationsResponse.status !== 200) {
                throw new Error('Errore nella richiesta API');
            }

            const pokemonInformationJSON = await pokemonInformationsResponse.json();

            const divTypes = document.createElement("div");
            divTypes.className = "divTypes";
            pokemonInformationJSON.types.forEach((type) => {
                const typeText = document.createElement("p")
                typeText.className = type.type.name;
                typeText.innerHTML = type.type.name;
                divTypes.appendChild(typeText);
            })
            pokemonName.appendChild(divTypes);

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



                console.log(pokemonInformationJSON)


                const random = Math.random();
                pokeball -= 1;

                if (random >= 0.5) { // condizioni di cattura
                    alert("Pokemon catturato!");
                    myPokemon.push(pokemons[j]);
                    pokemons[j] = null;
                    pokemonOwnedIndex.push(j);
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


/*  TODO implementare il filtro solo per il tipo del pokemon

const normalButton = document.createElement("button")
normalButton.innerHTML = "NormalPokemon";
normalButton.className = "sortButton"
normalButton.addEventListener("click", () => {
    console.log("funziona");
})

document.getElementById("filterNav").appendChild(normalButton);*/

await initializeVariables()

import {pokeballUpdater} from "./script";
import {candiesUpdater} from "./script";
import {checkAlreadyOwnedPokemon} from "./script";
import {displayPokemon} from "./script";

let pokemons = [];
let pokemonChain = [];
let myPokemon = [];


let candies = 100;
let pokeball = 100;
let pokemonOwnedIndex = [];

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
        localStorage.setItem("pokemonIndex", pokemonOwnedIndex)
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

    if (localStorage.getItem("0") == null) {
        getAllPokemons();
    } else {
        for (let i = 0; i < 1272; i++) {
            pokemons.push(JSON.parse(localStorage.getItem(i.toString())));
        }
        document.getElementById("candies").textContent = candies; //inizializza il testo di caramelle e pokemon
        setInterval(candiesUpdater, 1000);

        document.getElementById("pokeball").textContent = pokeball;
        setInterval(pokeballUpdater, 10000);
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

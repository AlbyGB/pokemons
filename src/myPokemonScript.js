import {candiesUpdater} from "./script";
import {pokeballUpdater} from "./script";

let pokemonOwnedIndex

if(localStorage.getItem("pokemonIndex") != null){

    pokemonOwnedIndex = localStorage.getItem("pokemonIndex").split(",");
} else {
    pokemonOwnedIndex = [];
}

console.log(pokemonOwnedIndex);

let pokemon = [];
let pokemonChain = [];
let myPokemon = [];
let candies = 100;
let pokeball = 100;


const displayPokemon = async () => {
    /* DA IMPLEMENTARE*/
    checkAlreadyOwnedPokemon();


    const div = document.getElementById("pokemon");

    while (div.firstChild) { // pullisce lo schermo per updatare i pokemon
        div.removeChild(div.firstChild);
    }

    document.getElementById("candies").textContent = candies; //inizializza il testo di caramelle e pokemon
    setInterval(candiesUpdater, 1000);

    document.getElementById("pokeball").textContent = pokeball;
    setInterval(pokeballUpdater, 10000);

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

    
    for (let i = 0; i < 1010; i++) { // mostra i pokemon
        if (pokemon[i] === null) continue;

        for (let j = 0; j < pokemonChain.length; j++) { // controlla che il pokemon appartenga a quelli base
            if (pokemonChain[j].chain.species.name === pokemon[i].name) {
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
                pokemonName.textContent = pokemon[i].name + "  #" + (i + 1);
                pokemonCardFront.appendChild(pokemonName);

                fetch(`https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`) // recupera l'immagine
                    .then(async response => {
                        if (!response.ok) {
                            throw new Error('Errore nella richiesta HTTP');
                        }

                        const bleb = await response.blob();

                        const image = document.createElement("img"); // immagine
                        image.className = "pokemonImage";
                        image.src = URL.createObjectURL(bleb);
                        pokemonCardFront.appendChild(image);
                    })
                    .catch(error => {
                        console.error(error);
                    });

                const imgPokemon = document.createElement("img"); // logo pokemon sul retro della card
                imgPokemon.src = "https://assets.pokemon.com/assets/cms2-it-it/img/misc/gus/buttons/logo-pokemon-79x45.png";
                pokemonCardBack.appendChild(imgPokemon);


                fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`) // recupero informazioni aggiuntive per il pokemon
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Errore nella richiesta API');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const abilityContainer = document.createElement("div"); // div abilità pokemon
                        abilityContainer.className = "abilityContainer";

                        abilityContainer.appendChild(document.createElement("hr"));

                        data.abilities.forEach(element => {
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
                                console.log("preso");
                                myPokemon.push(pokemon[i]);
                                pokemon[i] = null;
                                displayPokemon();
                            } else {
                                console.log("oh no è scappato");
                                document.getElementById("pokeball").textContent = pokeball;
                            }
                        });

                        pokemonCardBack.appendChild(catchButton);
                    })
                    .catch(error => {
                        console.error(error);
                    });


                pokemonContent.appendChild(pokemonCardFront);
                pokemonContent.appendChild(pokemonCardBack);
                pokemonDiv.appendChild(pokemonContent);

                div.appendChild(pokemonDiv);
                j = pokemonChain.length; // stoppa il for
            }
        }

    }

}

fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0.') // recupera tutti i pokemon
    .then(async response => {
        if (!response.ok) {
            throw new Error('Errore nella richiesta HTTP');
        }

        const myJson = await response.json();

        pokemon = Array.from(myJson.results);

        await displayPokemon();
    })
    .catch(error => {
        console.error(error);
    });

function checkAlreadyOwnedPokemon() { // da implementare quando ci sarà il salvataggio
    /*
        CONTROLLARE QUANDO SI CARICANO I DATI SAVATI 
        DI METTERE A NULL I POKEMON GIA IN MY POKEMON
    */
}

const candiesUpdater = ()=> { // aggiornamento temporizzato di caramelle e pokeball
    candies += 1;
    document.getElementById("candies").textContent = candies;
}
const pokeballUpdater = ()=> {
    pokeball += 1;
    document.getElementById("pokeball").textContent = pokeball;
}

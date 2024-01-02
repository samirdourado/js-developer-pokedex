const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `    
}

function loadPokemonItens(offset, limit) {
    return pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml;
    });
};

function handleClick() {
    const pokemonCards = document.querySelectorAll('.pokemon');
    pokemonCards.forEach((pokemonCard) => {
        pokemonCard.addEventListener('click', () => {
            const pokemonNumber = pokemonCard.id
            getEspecificPokemon(pokemonNumber);
        })
    });
};

function getEspecificPokemon(pokemonNumber) {    
    pokeApi.getPokemon(pokemonNumber)
        .then((pokemon) => {            
            pokemonModal(pokemon);
        });
};

function pokemonModal(pokemon) {
    console.log('Dados capturados', pokemon);    
}

loadPokemonItens(offset, limit)
    .then(() => {
        handleClick();
    });


loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        .then(() => {
            handleClick();
        });

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit)
        .then(() => {
            handleClick();
        });
    };
});

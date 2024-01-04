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
    const modalHolder = document.getElementById('modal_holder');
    const pokeModal = document.createElement("section");    
    const modalHeader = document.createElement('header');
    const pokemonNumber = document.createElement('p');
    const closeBtn = document.createElement('button');
    const pokemonName = document.createElement('h2');    
    const modalBody = document.createElement('main');
    const sectionTypes = document.createElement('ul');
    const image = document.createElement('img');    
    
    pokemonNumber.innerText = `Nº ${pokemon.number}`;
    closeBtn.innerText = `X`;
    pokemonName.innerText = `${pokemon.name}`;
    image.src = pokemon.photo;

    pokemon.types.forEach((type) => {
        const li = document.createElement('li');
        li.classList.add('pokemon_type', type);
        li.innerText = type;
        sectionTypes.appendChild(li);
    });
    
    modalHolder.classList.add(`${pokemon.type}`);    
    modalHolder.classList.add(`modal_holder`);
    pokeModal.classList.add('poke_modal');
    modalHeader.classList.add('poke_modal_header');
    pokemonNumber.classList.add('pokemon_number');
    closeBtn.classList.add('close_button');
    pokemonName.classList.add('pokemon_name');
    modalBody.classList.add('poke_modal_body');
    sectionTypes.classList.add('pokemon_types');
    image.classList.add('photo');    

    modalHolder.addEventListener('click', () => {
        modalHolder.classList.remove(`modal_holder`)
        modalHolder.classList.remove(`${pokemon.type}`)
        modalHolder.innerHTML = ""
    });    

    closeBtn.addEventListener('click', () => {
        modalHolder.classList.remove(`modal_holder`)
        modalHolder.classList.remove(`${pokemon.type}`)
        modalHolder.innerHTML = ""
    });
    
    modalHeader.append(pokemonNumber, closeBtn)
    modalBody.append(sectionTypes, image)
    pokeModal.append(modalHeader, pokemonName, modalBody)
    modalHolder.appendChild(pokeModal)
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

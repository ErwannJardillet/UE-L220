document.addEventListener('DOMContentLoaded', () => {

    const categories = [
        { nom: "Beef", label: "Bœuf", image: "https://www.themealdb.com/images/category/beef.png" },
        { nom: "Chicken", label: "Poulet", image: "https://www.themealdb.com/images/category/chicken.png" },
        { nom: "Dessert", label: "Desserts", image: "https://www.themealdb.com/images/category/dessert.png" },
        { nom: "Lamb", label: "Agneau", image: "https://www.themealdb.com/images/category/lamb.png" },
        { nom: "Miscellaneous", label: "Divers", image: "https://www.themealdb.com/images/category/miscellaneous.png" },
        { nom: "Pasta", label: "Pâtes", image: "https://www.themealdb.com/images/category/pasta.png" },
        { nom: "Pork", label: "Porc", image: "https://www.themealdb.com/images/category/pork.png" },
        { nom: "Starter", label: "Entrées", image: "https://www.themealdb.com/images/category/starter.png" },
        { nom: "Seafood", label: "Poisson", image: "https://www.themealdb.com/images/category/seafood.png" },
        { nom: "Vegan", label: "Vegan", image: "https://www.themealdb.com/images/category/vegan.png" },
        { nom: "Vegetarian", label: "Végétarien", image: "https://www.themealdb.com/images/category/vegetarian.png" },
        { nom: "Breakfast", label: "Petit-déjeuner", image: "https://www.themealdb.com/images/category/breakfast.png" }
    ];

    const $categorieGrid = $('#categorie-grid');
    const $categorieRecettes = $('#categorie-recettes');
    const $recetteCategorie = $('#recette-categorie');
    const $explorerCategories = $('#explorer-categories');

    function creerCarteRecette(recette) {
        const carte = $('<div>').addClass('carte');

        $('<h2>').text(recette.strMeal).appendTo(carte);
        $('<img>').attr({
            src: recette.strMealThumb,
            alt: recette.strMeal
        }).appendTo(carte);

        return carte;
    }

    function afficherRecettesAleatoires() {
        $('#recette').empty();
        for (let i = 0; i < 8; i++) {
            $.ajax({
                url: 'https://www.themealdb.com/api/json/v1/1/random.php',
                method: 'GET',
                dataType: 'json'
            })
            .then(function (donnees) {
                const recette = donnees.meals[0];
                if (!recette) return;
                $('#recette').append(creerCarteRecette(recette));
            })
            .catch(function (erreur) {
                console.error('Erreur :', erreur);
                $('#recette').text('Impossible de charger la recette.');
            });
        }
    }

    function afficherCategories() {
        $categorieGrid.empty();

        categories.forEach(function (categorie) {
            const bouton = $('<button>', {
                type: 'button',
                class: 'categorie-card',
                'data-categorie': categorie.nom,
                'aria-label': 'Afficher les recettes de ' + categorie.label
            });

            const image = $('<img>', {
                src: categorie.image,
                alt: categorie.label,
                class: 'categorie-image'
            });

            const label = $('<span>', {
                class: 'categorie-label',
                text: categorie.label
            });

            bouton.append(image, label);
            $categorieGrid.append(bouton);
        });
    }

    function afficherRecettesParCategorie(nomCategorie) {
        const categorie = categories.find(item => item.nom === nomCategorie);
        if (!categorie) return;

        $('#explorer-categories').addClass('is-category-open');
        $categorieRecettes.removeAttr('hidden');
        $categorieGrid.css('display', 'none');
        $recetteCategorie.empty();

        $.ajax({
            url: 'https://www.themealdb.com/api/json/v1/1/filter.php',
            method: 'GET',
            dataType: 'json',
            data: { c: nomCategorie }
        })
        .then(function (donnees) {
            const recettes = donnees.meals || [];

            if (!recettes.length) {
                $recetteCategorie.text('Aucune recette trouvée pour cette catégorie.');
                return;
            }

            const recettesAAfficher = recettes.slice(0, 12);
            recettesAAfficher.forEach(function (recette) {
                const carte = $('<div>').addClass('carte carte-categorie');

                $('<h2>').text(recette.strMeal).appendTo(carte);
                $('<img>').attr({
                    src: recette.strMealThumb,
                    alt: recette.strMeal
                }).appendTo(carte);

                $recetteCategorie.append(carte);
            });
        })
        .catch(function (erreur) {
            console.error('Erreur lors du chargement de la catégorie :', erreur);
            $recetteCategorie.text('Impossible de charger les recettes de cette catégorie.');
        });
    }

    function retourVersCategories() {
        $categorieRecettes.attr('hidden', 'hidden');
        $categorieGrid.css('display', 'grid');
        $('#explorer-categories').removeClass('is-category-open');
        $recetteCategorie.empty();
    }

    // Affichage de 8 recette au hasard
    afficherRecettesAleatoires();
    afficherCategories();

    // Bouton pour changer les recette afficher au hasard
    $('#autre-recette').on('click', function () {
        afficherRecettesAleatoires();
    });

    // Utilisation de la barre de recherche
    $('#recherche').on('input', function () {
        const recherche = $(this).val();

        if (recherche === '') {
            afficherRecettesAleatoires();
            return;
        }

        $.ajax({
            url: 'https://www.themealdb.com/api/json/v1/1/search.php',
            method: 'GET',
            dataType: 'json',
            data: { s: recherche },
        })
        .then(function (donnees) {
            $('#recette').empty();

            if (!donnees.meals) {
                $('#recette').text('Aucune recette trouvée.');
                return;
            }

            for (let i = 0; i < donnees.meals.length && i < 8; i++) {
                const recette = donnees.meals[i];
                $('#recette').append(creerCarteRecette(recette));
            }
        })
        .catch(function (erreur) {
            console.error('Erreur :', erreur);
            $('#recette').text('Impossible de rechercher les recettes.');
        });
    });

    $(document).on('click', '.categorie-card', function (event) {
        event.preventDefault();
        const scrollY = window.scrollY;
        const categorie = $(this).data('categorie');
        $(this).blur();
        afficherRecettesParCategorie(categorie);
        setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' });
        }, 0);
    });

    $('#retour-categories').on('click', function (event) {
        event.preventDefault();
        const scrollY = window.scrollY;
        $(this).blur();
        retourVersCategories();
        setTimeout(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' });
        }, 0);
    });

});

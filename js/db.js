//offline data
db.enablePersistence().catch(err => {
    if (err.code == 'failed-precondition') {
        //probably multiple tabs open at once
        console.log('persistence failed')
    }
    else if (err.code == 'unimplemented') {
        console.log('persistense in not available')
    }
})


// real time listener

db.collection('recipes').onSnapshot((snapshot) => {
    console.log(snapshot.docChanges())
    console.log('from db')
    snapshot.docChanges().forEach((change) => {
        console.log(change, change.doc.data(), change.doc.id)
        if (change.type === 'added') {
            renderRecepies(change.doc.data(), change.doc.id) //function is in ui.js
        }
        if (change.type === 'removed') {
            //removed
            removeRecipe(change.doc.id)
        }
    })
})


//addition of recipes
const form = document.querySelector('form')
form.addEventListener('submit', evt => {
    evt.preventDefault()  //default action is to refresh that page. we want to prevent that.
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }
    db.collection('recipes').add(recipe)
        .catch(error => console.log(error));
    form.title.value = '';
    form.ingredients.value = '';
})

//delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    console.log('clicked and deleted', evt);
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete()

    }
})
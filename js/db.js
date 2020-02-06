// Offline data
db.enablePersistence().catch(err => {
  if (err.code == 'failed-precondition') {
    // probably multiple tabs opened at once
    console.log('persistence failed');
  } else if (err.code == 'unimplemented') {
    // lack of browser support
    console.log('persistence is not available');
  }
});

// Real-time listener - listen to this collection and when there is a change
// I want firestore to send me a snapshot of the changes in the collection at
// that point in time.
db.collection('recipes').onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === 'added') {
      // add document data to web page
      renderRecipe(change.doc.data(), change.doc.id);
    }

    if (change.type === 'removed') {
      // remove document data from web page
      removeRecipe(change.doc.id);
    }
  });
});

// Add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', event => {
  event.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
    instructions: form.instructions.value,
    createdby: form.creator.value
  };

  db.collection('recipes')
    .add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
  form.instructions.value = '';
  form.creator.value = '';
});

// Delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', event => {
  console.log(event);
  if (event.target.tagName === 'I') {
    const id = event.target.getAttribute('data-id');
    console.log(id);
    db.collection('recipes')
      .doc(id)
      .delete();
  }
});
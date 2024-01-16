import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector(".form");
const ul = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

var lightbox = new SimpleLightbox('.gallery a', {   
  captionsData: 'alt',
  captionDelay: 250, }); 
form.addEventListener("submit", createListItem)


function createListItem(event){
  event.preventDefault();
  ul.innerHTML = "";
  const itemParam = new URLSearchParams({
    key:"41728524-9ad3c3555a09648a5caa6ae20",
    q:form.item.value.trim(),
    image_type : "photo",
    orientation :"horizontal",
    safesearch : true
  });
  loader.classList.remove("search");
  fetch(`https://pixabay.com/api/?${itemParam}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Request error");
    }
    return response.json();
  })
  .then(result => {
    if (result.hits.length === 0) {
      iziToast.error({
        title: 'No result',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position:"topRight"
      });
    }
    console.log(result);
    const markup = result.hits.reduce((acc, elem)=>
      acc + `<li class="element"><a href="${elem.largeImageURL}"><img class="image" src="${elem.webformatURL}"  alt="${elem.tags}"></a>
      <div class="container-stat">
      <p class="stat">Likes <span class="stat-value">${elem.likes}</span></p>
      <p class="stat">Views <span class="stat-value">${elem.views}</span></p>
      <p class="stat">Comments <span class="stat-value">${elem.comments}</span></p>
      <p class="stat">Downloads <span class="stat-value">${elem.downloads}</span></p>
      </div></li>`, "")

    ul.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
  })
  .catch(error => console.log(error))
  .finally(()=>{
    loader.classList.add('search');
    form.reset();
  });
}
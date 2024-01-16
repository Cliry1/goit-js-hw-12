import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector(".form");
const ul = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const btnMore = document.querySelector(".button-load-more");

let searchInfo;
let pageCount;
const limit = 40;
let totalItems;

var lightbox = new SimpleLightbox('.gallery a', {   
  captionsData: 'alt',
  captionDelay: 250, }); 


form.addEventListener("submit", createListItem);

async function createListItem(event){
  btnMore.classList.add('search');
  event.preventDefault();
  searchInfo= form.item.value.trim();
  ul.innerHTML = ""
  pageCount=1;
  loader.classList.remove("search");
  const posts = await paramList(pageCount, searchInfo);
  createImg(posts);
  form.reset();
  if(totalItems>40){
    btnMore.classList.remove('search');
  }
  else{
    btnMore.classList.add('search');
  }
}


btnMore.addEventListener("click", async ()=>{
  try {
    btnMore.classList.add('search');
    pageCount++;
    const posts = await paramList(pageCount,searchInfo);
    createImg(posts);
    if(pageCount>=Math.ceil(totalItems/limit)){
      btnMore.classList.add("search");
      return iziToast.error({
        position: "topRight",
        message: "We're sorry, but you've reached the end of search results."
      });
    }
    else{
      btnMore.classList.remove('search');
    }


  } catch (error) {
    console.log(error)
  }
})



async function paramList(pageCount, searchInfo){
  const itemParam = new URLSearchParams({
    key:"41728524-9ad3c3555a09648a5caa6ae20",
    q:searchInfo,
    image_type : "photo",
    orientation :"horizontal",
    safesearch : true,
    page : pageCount,
    per_page: limit
  });
  const collection = await axios.get(`https://pixabay.com/api/?${itemParam}`)
  return collection.data;
}


function createImg(posts){
  if(posts.total === 0){
    iziToast.error({
      title: 'No result',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position:"topRight"
    });
    loader.classList.add('search');
    return;
  }
  const markup = posts.hits.reduce((acc, elem)=>
  acc + `<li class="element"><a href="${elem.largeImageURL}"><img class="image" src="${elem.webformatURL}"  alt="${elem.tags}"></a>
  <div class="container-stat">
  <p class="stat">Likes <span class="stat-value">${elem.likes}</span></p>
  <p class="stat">Views <span class="stat-value">${elem.views}</span></p>
  <p class="stat">Comments <span class="stat-value">${elem.comments}</span></p>
  <p class="stat">Downloads <span class="stat-value">${elem.downloads}</span></p>
  </div></li>`, "")
 
  ul.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
  loader.classList.add('search');
  totalItems = posts.totalHits;

}

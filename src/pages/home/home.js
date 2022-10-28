import {
  logoutUser, auth, getPosts, deletePost, forEditPost,
} from '../../lib/auth.js';

// eslint-disable-next-line consistent-return
export default () => {
  if (auth.currentUser !== null) {
    const container = document.createElement('div');
    const template = `<section>
      <nav id="mobile-top-icons" class="icons-container">
        <img id="menu-icon" class="icons-size" src="./external/svg/menu-icon.svg"/>
        <img id="home-icon" class="icons-size" src="./external/svg/home-icon.svg"/>
        <img id="logout-icon" class="icons-size" src="./external/svg/log-out-icon.svg"/>
      </nav>
      <hr class="colorful-line"/>
      <div>
        <p id="welcome-user">Olá, ${auth.currentUser.displayName}! Esta é a Página Inicial.</p>
      </div>
      <hr class="colorful-line"/>
      <section class="post-container"></section> 
      <hr class="colorful-line"/>
      <nav id="mobile-footer-icons" class="icons-container">
        <img id="plus-icon" class="icons-size" src="./external/svg/plus-icon.svg"/>
        <img id="plate-icon" class="icons-size" src="./external/svg/logo.png"/>
        <img id="up-icon" class="icons-size" src="./external/svg/chevron-up-icon.svg"/>
      </nav>
    </section>`;

    container.innerHTML = template;

    const firstLetter = (element) => {
      const getFirst = element[0];
      return getFirst;
    };

    const printPosts = async () => {
      const all = await getPosts();
      const mapPosts = all.map((posts) => {
        let postsTemplate = '';
        if (auth.currentUser.uid === posts.author) {
          postsTemplate = `<div data-id="${posts.id}" class="posts">
          <div id="text">
            <p>@ ${posts.name}</p>
            <p id="local" data-editlocal="${posts.id}" class="edit-local establishment" contenteditable="false">${posts.restaurant}</p>
            <p id="adress" data-editadress="${posts.id}" class="edit-adress" contenteditable="false">${posts.adress}</p>
            <p id="review" data-editreview="${posts.id}" class="edit-review" contenteditable="false">${posts.review}</p>
          </div>
  
          <button id="cancel">Cancelar</button>
          <button id="ok" data-edit="${posts.id}">OK</button>
      
          <div id="modal-delete" class="hide">
            <p>Tem certeza que deseja excluir este post?</p>
            <button data-delete="${posts.id}" id="yes-delete">Sim</button>
            <button id="no-close">Não</button>
          </div>
      
          <aside class="infos-container">
            <div>
              <div id="user-image"><p class="name-letter">${firstLetter(posts.name)}</p></div>
              <p id="grade">4.7</p>
              <div class="icons-post">
                <img id="heart-icon" class="icons-post-size" src="./external/svg/heart-icon.svg"/>
                <img id="pencil-icon" class="icons-post-size icons-current-user" src="./external/svg/pencil-icon.svg"/>
                <img id="trash-icon" class="icons-post-size icons-current-user" src="./external/svg/trash-icon.svg"/>
              </div>
            </div>
          </aside>
          </div>
          <hr class="colorful-line"/>`;
        } else {
          postsTemplate = `<div data-id="${posts.id}" class="posts">
          <div id="text">
            <p>@ ${posts.name}</p>
            <p id="local" data-editlocal="${posts.id}">${posts.restaurant}</p>
            <p id="adress" data-editadress="${posts.id}">${posts.adress}</p>
            <p id="review" data-editreview="${posts.id}">${posts.review}</p>
          </div>
          <aside class="infos-container">
            <div>
              <div id="user-image"><p class="name-letter">${firstLetter(posts.name)}</p></div>
              <p id="grade">4.7</p>
              <img id="heart-icon" class="icons-post-size" src="./external/svg/heart-icon.svg"/>
            </div>
          </aside>
          </div>
          <hr class="colorful-line"/>`;
        }
        return postsTemplate;
      }).join('');
      container.querySelector('.post-container').innerHTML += mapPosts;

      const cancelEdit = container.querySelector('#cancel');
      const okEdit = container.querySelector('#ok');
      const editPost = container.querySelector('#pencil-icon');
      const local = container.querySelector('#local');
      const adress = container.querySelector('#adress');
      const review = container.querySelector('#review');

      cancelEdit.hidden = true;
      okEdit.hidden = true;

      function show(elemento) {
        elemento.focus();
      }

      editPost.addEventListener('click', () => {
        cancelEdit.hidden = false;
        okEdit.hidden = false;
        review.contentEditable = true;
        show(review);
        local.contentEditable = true;
        show(local);
        adress.contentEditable = true;
        show(adress);
      });

      okEdit.addEventListener('click', (e) => {
        const dataEditAtributte = e.target.dataset.edit;
        forEditPost(dataEditAtributte);
        cancelEdit.hidden = true;
        okEdit.hidden = true;
        // console.log(dataEditAtributte);
      });

      cancelEdit.addEventListener('click', () => {
        cancelEdit.hidden = true;
        okEdit.hidden = true;
        review.contentEditable = false;
        local.contentEditable = false;
        adress.contentEditable = false;
      });

      const modalDelete = container.querySelector('#modal-delete');
      const warnDelete = container.querySelector('#trash-icon');
      const closeModalDelete = container.querySelector('#no-close');
      const yesModalDelete = container.querySelector('#yes-delete');

      warnDelete.addEventListener('click', () => {
        modalDelete.classList.toggle('hide');
      });

      closeModalDelete.addEventListener('click', () => {
        modalDelete.classList.toggle('hide');
      });

      yesModalDelete.addEventListener('click', (e) => {
        const dataDeleteAtributte = e.target.dataset.delete;
        deletePost(dataDeleteAtributte);
        modalDelete.classList.toggle('hide');
        const divToRemove = container.querySelector(`[data-id="${dataDeleteAtributte}]`);
        divToRemove.style.display = 'none';
      });
    };
    printPosts();

    const logout = container.querySelector('#logout-icon');
    const toTheTop = container.querySelector('#up-icon');
    const newPost = container.querySelector('#plus-icon');

    logout.addEventListener('click', () => {
      logoutUser();
    });

    toTheTop.addEventListener('click', () => {
      window.scrollTo(0, 0);
    });

    newPost.addEventListener('click', () => {
      window.location.hash = '#novo_post';
    });

    return container;
  }
  window.location.hash = '#login';
};

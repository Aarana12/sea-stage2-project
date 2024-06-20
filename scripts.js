
class BookNode {
    constructor(title, image, author, genre, value, left = null, right = null) {
        this.title = title;
        this.image = image;
        this.author = author;
        this.genre = genre;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class AVLBinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(title, image, author, genre, value) {
        var newBookNode = new BookNode(title, image, author, genre, value);
        if(this.root === null)
            this.root = newBookNode;
        else 
            this.insertNode(this.root, newBookNode);
    }

    insertNode(bookNode, newBookNode) {
        console.log(newBookNode.value);
        if(newBookNode.value < bookNode.value) {
            if (bookNode.left === null)
                bookNode.left = newBookNode;
            else 
                this.insertNode(bookNode.left, newBookNode);  
        }
        else {
            if(bookNode.right === null) 
                bookNode.right = newBookNode;
            else
                this.insertNode(bookNode.right, newBookNode);
        }
    }

    search(root, title) // later change parameters to the value that the user wants to search and the user input value
    {
        // if trees is empty return null
        if(root === null){
            return null; 
        }

        // if data is less than node's data
        // move left
        else if(title < root.title)
            return this.search(root.left, title);

        // if data is more than node's data
        // move right
        else if(title > root.title)
            return this.search(root.right, title);

        // if data is equal to the node data 
        // return node
        else
            return root;
    }
    inOrderSearch(root, title, childBooks)
    {
 
        if(root === null)
            return;
        inOrderSearch(root.left, title, childBooks);
        if (toLowerCase(root.title).includes(toLowerCase(title)) )
                childBooks.add(root);
        inOrderSearch(root.right, title, childBooks);    
    }

}

var BookCatalog = new AVLBinarySearchTree();

function showCards(titles, images, authors, genres) {
    const cardContainer = document.querySelector(".CatalogContainerClass");
    const templateCard = document.querySelector(".bookCard");

    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent(nextCard, titles, images, authors, genres); // Edit title and image
    cardContainer.appendChild(nextCard); // Add new card to the container
}

function showSearchedCard() {
    let titleSearch = document.getElementById("searchBookCatalog");

    if (titleSearch != null)
        console.log("Searched for " + titleSearch.value);

    
    
    //var getSearchedBook = BookCatalog.search(BookCatalog.root, titleSearch.value);

    //Above, the search is looked for and the result, getSearchedbBook holds the root. It is a tree node
    // I want to make an array here that is gonna hold all the tree nodes

    let childBooks  = new Set();
    BookCatalog.inOrderSearch(BookCatalog.root, titleSearch.value, childBooks);
    childBooks.forEach(bookValue)
    {
 
        const templateCard = document.querySelector(".bookCard");
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editSearchedCardContent(nextCard, bookValue); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
    }
    


    const cardContainer = document.querySelector(".CatalogContainerClass");
    var seeAllButton = document.querySelector(".seeAllButton");
    seeAllButton.style.display = "block";
    cardContainer.innerHTML = "";

    if (getSearchedBook === null) 
        {      
        var searchBookAlert = document.querySelector("#searchBookAlert");
        searchBookAlert.style.display = "block";
        cardContainer.appendChild(searchBookAlert);
        return;
    }
    else {
        const templateCard = document.querySelector(".bookCard");
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editSearchedCardContent(nextCard, getSearchedBook); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
    }
    
}

//eventually sort the order the card by different values accroding to the options i give them through the search
function editCardContent(card, title, image, author, genre) {
    card.style.display = "block";
    const cardHeader = card.querySelector(".bookTitle");
    const cardAuthor = card.querySelector(".author");
    const cardImage = card.querySelector(".coverImage");
    const cardGenre = card.querySelector(".genre");
    cardHeader.textContent = title;
    cardAuthor.textContent = author;
    cardImage.src = image;
    cardGenre.textContent = genre;
}

function editSearchedCardContent(card, book) {
    card.style.display = "block";
    const cardHeader = card.querySelector(".bookTitle");
    const cardAuthor = card.querySelector(".author");
    const cardImage = card.querySelector(".coverImage");
    const cardGenre = card.querySelector(".genre");
    cardHeader.textContent = book.title;
    cardAuthor.textContent = book.author;
    cardImage.src = book.image;
    cardGenre.textContent = book.genre;
}

document.addEventListener("DOMContentLoaded", getBooks);


function getBooks(){
    const cardContainer = document.querySelector(".CatalogContainerClass");
    cardContainer.innerHTML = "";
    const seeAllButton = document.querySelector(".seeAllButton");
    seeAllButton.style.display = "none";
    var xhttp, xmlDoc, numberOfObjects, title, image, author, genre;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(this.response, "application/xml");
        numberOfObjects = xmlDoc.getElementsByTagName("id");
        title = xmlDoc.getElementsByTagName("title");
        image = xmlDoc.getElementsByTagName("cover");
        author = xmlDoc.getElementsByTagName("author");
        genre = xmlDoc.getElementsByTagName("genre");
        orderBooks(numberOfObjects, title, image, author, genre, title);
      }
    };
    xhttp.open("GET", "data.xml", true);
    xhttp.send();
}

function orderBooks(numberOfObjects, title, image, author, genre, value) {
    for (var i = 0; i < numberOfObjects.length; i++) {
        var titles = title[i].childNodes[0].nodeValue;
        var images = image[i].childNodes[0].nodeValue;
        var authors = author[i].childNodes[0].nodeValue;
        var genres = genre[i].childNodes[0].nodeValue;
        var values = value[i].childNodes[0].nodeValue;

        BookCatalog.insert(titles, images, authors, genres, values); // here the user should be given the chance to decide what value they want to order the
        showCards(titles, images, authors, genres);
        console.log(BookCatalog); 
    };
}

document.addEventListener('click', event => {
    if(event.target.closest('.card') === null) {
        return;
    }
    else {
        const card = event.target.closest('.card');

    const selectedAuthor = card.querySelector('.author');
    const selectedGenre = card.querySelector('.genre');
    const selectedTitle = card.querySelector('h2');
    const selectedBookCover = card.querySelector('img');

    var imageInput = document.getElementById("selectedBookCover");
    imageInput.src = selectedBookCover.src;

    var titleInput = document.getElementById("selectedBookTitle");
    titleInput.value = selectedTitle.textContent;
    var authorInput = document.getElementById("selectedBookAuthor");
    authorInput.value = selectedAuthor.textContent;
    var genreInput = document.getElementById("selectedBookGenre");
    genreInput.value = selectedGenre.textContent;

    var searchTab = document.getElementById("search");
    searchTab.classList.remove("show");
    searchTab.classList.remove("active");

    var notesTab = document.getElementById("notes");
    notesTab.classList.add("show");
    notesTab.classList.add("active");   

    var searchNavTab = document.getElementById("search-tab");
    searchNavTab.classList.remove("active");

    var notesNavTab = document.getElementById("notes-tab");
    notesNavTab.classList.add("active");
    }
});

function backToSearch() {
    var searchTab = document.getElementById("search");
    searchTab.classList.add("show");
    searchTab.classList.add("active");

    var notesTab = document.getElementById("notes");
    notesTab.classList.remove("show");
    notesTab.classList.remove("active");   

    var notesNavTab = document.getElementById("notes-tab");
    notesNavTab.classList.remove("active");

    var searchNavTab = document.getElementById("search-tab");
    searchNavTab.classList.add("active");
}

// Journal tab js

class BookEntryNode {
    constructor(title, image, author, genre, startDate, finishDate, rating, thoughts, value, left = null, right = null) {
        this.title = title;
        this.image = image;
        this.author = author;
        this.genre = genre;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.rating = rating;
        this.thoughts = thoughts;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class RbBinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(titles, images, authors, genres, startDate, finishDate, ratings, thoughts, values) {
        var newBookEntryNode = new BookEntryNode(titles, images, authors, genres, startDate, finishDate, ratings, thoughts, values);
        console.log(newBookEntryNode);
        if(this.root === null)
            this.root = newBookEntryNode;
        else 
            this.insertNode(this.root, newBookEntryNode);
    }

    insertNode(bookEntryNode, newBookEntryNode) {
        console.log(newBookEntryNode.value);
        if(newBookEntryNode.value < bookEntryNode.value) {
            if (bookEntryNode.left === null)
                bookEntryNode.left = newBookEntryNode;
            else 
                this.insertNode(bookEntryNode.left, newBookEntryNode);  
        }
        else {
            if(bookEntryNode.right === null) 
                bookEntryNode.right = newBookEntryNode;
            else
                this.insertNode(bookEntryNode.right, newBookEntryNode);
        }
    }

    search(root, title) // later change parameters to the value that the user wants to search and the user input value
    {
        // if trees is empty return null
        if(root === null){
            return null; 
        }

        // if data is less than node's data
        // move left
        else if(title < root.title)
            return this.search(root.left, title);

        // if data is more than node's data
        // move right
        else if(title > root.title)
            return this.search(root.right, title);

        // if data is equal to the node data 
        // return node
        else
        {
            return root;
            console.log("Search Match Found");
        }
    }

    /* Inorder(tree) {
        return Inorder(left-subtree) + root + Inorder(right-subtree)
    } */

    printInorder(node) {
        if (node == null)
            return;
     
        // First recur on left child */
        BookJournal.printInorder(node.left);

        const cardContainer = document.querySelector(".bookJournalContainerClass");
        const templateCard = document.querySelector(".entryCard");

        const nextCard = templateCard.cloneNode(true); // Copy the template card
        editBookEntryCardContent(nextCard, node.title, node.image, node.author, node.rating, node.thoughts); // Edit title and image
        cardContainer.appendChild(nextCard); // Add new card to the container
     
        // Now recur on right child
        BookJournal.printInorder(node.right);
    }
    
}

var BookJournal = new RbBinarySearchTree();

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.querySelector(".bookJournalContainerClass");
    if (cardContainer.innerHTML === "") {
        var emptyMessage = document.querySelector(".bookJournalMessage");
        emptyMessage.style.display = "block";
        cardContainer.appendChild(emptyMessage);
    }
    const form = document.querySelector("#journalEntryForm");
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        var notesTab = document.getElementById("notes");
        notesTab.classList.remove("show");
        notesTab.classList.remove("active");
    
        var journalTab = document.getElementById("journal");
        journalTab.classList.add("show");
        journalTab.classList.add("active");   
    
        var notesNavTab = document.getElementById("notes-tab");
        notesNavTab.classList.remove("active");
    
        var journalNavTab = document.getElementById("journal-tab");
        journalNavTab.classList.add("active");

        const formData = new FormData(form);
        let arr = [];
        var image = document.getElementById("selectedBookCover");
        arr.push(image.src);
        for (const [key, value] of formData) {
            arr.push(value);
            /* ['https://m.media-amazon.com/images/I/71KcUgYanhL._AC_UF1000,1000_QL80_.jpg', 
            'Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'Fiction', '2024-04-09', '2024-04-09', '1', 'Good!'] 
            (titles, images, authors, genres, startDate, finishDate, ratings, thoughts, values)*/ 
        }
        BookJournal.insert(arr[1], arr[0], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[5]);
        console.log(arr);
        console.log(BookJournal);       
        cardContainer.innerHTML = "";
        BookJournal.printInorder(BookJournal.root);
    });
  });

function editBookEntryCardContent(card, title, image, author, rating, thoughts) {
    card.style.display = "block";
    const cardHeader = card.querySelector(".entryTitle");
    const cardAuthor = card.querySelector(".entryAuthor");
    const cardImage = card.querySelector(".entryImage");
    const cardRating = card.querySelector(".rating");
    const cardThoughts = card.querySelector(".thoughts");
    cardHeader.textContent = title;
    cardAuthor.textContent = author;
    cardImage.src = image;
    cardRating.textContent = rating;
    cardThoughts.textContent = thoughts;
}

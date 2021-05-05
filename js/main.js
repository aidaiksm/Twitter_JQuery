// elements--------------------------------------------------
let inp = $('#inp-tweet');
let send = $('#btn-tweet');
let list = $('.tweets');


let modal = $('.modal');
let overlay = $('#overlay');
let modalInp = $('.modal-input');
let modalSave = $('.modal-save');
let modalClose = $('.close-button');
let retweetList = $('.retweet');


let pagBack = $('.back');
let pagNext = $('.next');




// Add tweet -------------------------------------------------

send.on('click', function(){
    let newMsg = {
        message: inp.val()

    }
    if(!inp.val()) return; 

    postTweet(newMsg)
    inp.val('')

})



function postTweet(msg){
    fetch('http://localhost:8000/tweets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(msg)
    })
    .then(() => render())
}


// Show tweets ------------------------------------------------

let page = 1

function render(){
    let promise = fetch(`http://localhost:8000/tweets?_page=${page}&_limit=2`)
    promise
        .then((response) => response.json())
        .then((data) => {
            list.html('')
            data.forEach(item => {
                list.append(`<div id=${item.id}>${item.message}
                <div class="icons">
                                <a href="">
                                    <img class="action-icon comment" src="./img/icons/comment.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon heart" src="./img/icons/heart.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon retweet" src="./img/icons/retweet.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon edit" src="./img/icons/edit.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon delete" src="./img/icons/x-mark.svg" alt="">
                                </a>
                            </div>
                            </div>`)
            })
        })
}



// Pagination-----------------------------------------------

pagBack.on('click', () => {
    page--
    render()
    console.log(page)
})

pagNext.on('click', () => {
    page++
    render()
    console.log(page)
})



// Delete tweet -------------------------------------------


$('body').on('click', '.delete', function(event){
    event.preventDefault()
    let id = event.target.parentNode.parentNode.parentNode.id
    fetch(`http://localhost:8000/tweets/${id}`,  {
        method: 'DELETE'
    })
    .then(() => render())
})


// Edit tweet ---------------------------------------------

$('body').on('click', '.edit', function(event){
    event.preventDefault()
    let id = event.target.parentNode.parentNode.parentNode.id
    let txt = event.target.parentNode.parentNode.parentNode.firstChild.data
    overlay.addClass('active')
    modal.addClass('active')
    modalInp.val(txt)
    modalSave.on('click', function(){
        newTxt = {
            message: modalInp.val()
        } 
        modal.removeClass('active')
        overlay.removeClass('active')
        if(!modalInp.val()) return; 
        fetch(`http://localhost:8000/tweets/${id}`,  {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newTxt)
        })
        .then(() => render())
    });
})

// Close Pop Up window ------------------------------------


modalClose.on('click', () => {
    modal.removeClass('active')
    overlay.removeClass('active')
})







// Retweets --------------------------------------------


$('body').on('click', '.retweet', function(event){
    event.preventDefault()
    let msgId = event.target.parentNode.parentNode.parentNode.id
    let txt = event.target.parentNode.parentNode.parentNode.firstChild.data

    let retweetMsg = {
        message: txt
    }
    createRetweet(retweetMsg)
})




// Retweet tweet -------------------------------------------


function createRetweet(retweetMsg){
    let promise = fetch('http://localhost:8000/retweets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(retweetMsg)
    })
    .then(() => render())
}



// Show retweet --------------------------------------------

function renderRetweets(msgId){
    let promise = fetch('http://localhost:8000/retweets')
    promise
        .then((response) => response.json())
        .then((data) => {
            data.forEach(item => {
                    retweetList.append(`<div id=${item.id}>${item.message}
                    <div class="icons">
                                    <a href="">
                                        <img class="action-icon comment" src="./img/icons/comment.svg" alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon heart" src="./img/icons/heart.svg" alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon edit" src="./img/icons/edit.svg" alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon delete" src="./img/icons/x-mark.svg" alt="">
                                    </a>
                                </div>
                                </div>`)
            })
        })
}






renderRetweets()
render()



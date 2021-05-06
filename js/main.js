// Elements--------------------------------------------------
let inp = $('.inp-tweet');
let send = $('#btn-send');
let list = $('.tweets');


let modal = $('.modal');
let overlay = $('#overlay');
let modalInp = $('.modal-input');
let modalSave = $('.modal-save');
let modalClose = $('.close-button');
let retweetList = $('.retweet');


let pagBack = $('#back');
let pagNext = $('#next');
let pagNum = $('#page-number');



let searchInp = $('.inp-search');
let searchBtn = $('#btn-search');
let feedTitle = $('.feed-title');


let comment = $('.comment');
let commentHeader = $('.comment-header')



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
    fetch('http://localhost:3000/tweets', {
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
    let promise = fetch(`http://localhost:3000/tweets?_page=${page}&_limit=2`)
    promise
        .then((response) => response.json())
        .then((data) => {
            list.html('')
            data.forEach(item => {
                pagNum.html('')
                pagNum.append(page)
                list.append(`<div id=${item.id}>${item.message}
                <div class="icons">
                                <a href="">
                                    <img class="action-icon reply" src="./img/icons/comment.svg" alt="">
                                </a>
                                <div>
                                <a href="">
                                    <img class="action-icon heart" src="./img/icons/heart.svg" alt="">
                
                                </a>
                                <span>${item.likes}<span>
                                </div>
                                <a href="">
                                    <img class="action-icon share" src="./img/icons/retweet.svg" alt="">
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
    if(page > 1){page--}
    render()
    pagNum.html('')
    pagNum.append(page)
})

pagNext.on('click', () => {
    let promise = fetch('http://localhost:3000/tweets/')
    promise
        .then((response) => response.json())
        .then((data) => {
            let max = data.length
            maxPage = max / 2
            if(page < maxPage){
                page++
            }
        })
    render()
    pagNum.html('')
    pagNum.append(page)

})



// Search -------------------------------------------------

searchBtn.on('click', function(){
    let searchTxt = searchInp.val()
    if(!searchTxt){
        render() 
        return}
    search(searchTxt)
    searchInp.val('')
})


function search(searchTxt){
    let promise = fetch(`http://localhost:3000/tweets?q=${searchTxt}`)
    promise
        .then((response) => response.json())
        .then((data) => {
            list.html('')
            data.forEach(item => {
                pagBack.hide()
                pagNext.hide()
                pagNum.hide()
                feedTitle.html('Search results:')
                list.append(`<div id=${item.id}>${item.message}
                <div class="icons">
                                <a href="">
                                    <img class="action-icon reply" src="./img/icons/comment.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon heart" src="./img/icons/heart.svg" alt="">
                                </a>
                                <a href="">
                                    <img class="action-icon share" src="./img/icons/retweet.svg" alt="">
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





// Delete tweet -------------------------------------------


$('body').on('click', '.delete', function(event){
    event.preventDefault()
    let id = event.target.parentNode.parentNode.parentNode.id
    fetch(`http://localhost:3000/tweets/${id}`,  {
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
        fetch(`http://localhost:3000/tweets/${id}`,  {
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
    comment.removeClass('active')
    overlay.removeClass('active')
})












// Retweets --------------------------------------------


$('body').on('click', '.share', function(event){
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
    let promise = fetch('http://localhost:3000/retweets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(retweetMsg)
    })
    .then(() => renderRetweets())
}



// Show retweet --------------------------------------------

function renderRetweets(){
    let promise = fetch('http://localhost:3000/retweets')
    promise
        .then((response) => response.json())
        .then((data) => {
            data.forEach(item => {
                    console.log(item)
                    retweetList.append(`<div id=${item.id}>${item.message}
                    <div class="icons">
                                    <a href="">
                                        <img class="action-icon re-reply" src="./img/icons/comment.svg"  alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon re-heart" src="./img/icons/heart.svg" alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon re-edit" src="./img/icons/edit.svg" alt="">
                                    </a>
                                    <a href="">
                                        <img class="action-icon re-delete" src="./img/icons/x-mark.svg" alt="">
                                    </a>
                                </div>
                                </div>`)
            })
        })
}



// Delete retweet --------------------------------------------


$('body').on('click', '.re-delete', async function(event){
    let retweetid = event.target.parentNode.parentNode.parentNode.id
    console.log(retweetid)
    let response = await fetch(`http://localhost:3000/retweets/${retweetid}`,  {
        method: 'DELETE'
    })
    renderRetweets()
})







// Like tweet ------------------------------------------------

$('body').on('click', '.heart', async function(event){
    event.preventDefault()
    let msgId = event.target.parentNode.parentNode.parentNode.id
    let resp = await fetch(`http://localhost:3000/tweets/${msgId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify()
    })
    let obj = await resp.json()
    console.log(obj)

    if(obj.likes === NaN){
        let newLike = {
            likes: 1
        }
        likeTweet(newLike, msgId)
    }else{
        let likeNum = ++ obj.likes
        let newLike = {
            likes: likeNum
        }
        likeTweet(newLike, msgId)

    }
})


function likeTweet(like, msgId){
    fetch(`http://localhost:3000/tweets/${msgId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(like)
    })
}


// Comment tweet -------------------------------------------------

// $('body').on('click', '.reply', function(event){
//     event.preventDefault()
//     let id = event.target.parentNode.parentNode.parentNode.id
//     let txt = event.target.parentNode.parentNode.parentNode.firstChild.data
//     overlay.addClass('active')
//     comment.addClass('active')
//     commentHeader.after(`<div id=${id} class="msg">${txt}</div>`)
//     console.dir(comment[0])
//     modalSave.on('click', function(){
//         newTxt = {
//             message: modalInp.val()
//         } 
//         comment.removeClass('active')
//         overlay.removeClass('active')
//         if(!modalInp.val()) return; 
//         fetch(`http://localhost:3000/tweets/${id}`,  {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json;charset=utf-8'
//             },
//             body: JSON.stringify(newTxt)
//         })
//         .then(() => render())
//     });
// })



renderRetweets()
render()



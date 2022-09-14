function makeEllipsisText(unique) {
    $(unique).css({'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis'})
}

function revealEllipsisText(unique) {
    $(unique).css({'white-space': 'normal', 'overflow': '', 'text-overflow': ''})
}

function appDescEllipsis(unique, unique_caller) {
    let elm = $(unique)
    let elmCaller = $(unique_caller)
    let elmCallerText = elmCaller.find('span')
    let elmChild = elmCaller.find('i')

    console.log(elmChild.attr('class').includes('fa-chevron-down'))
    if (elmChild.attr('class').includes('fa-chevron-down')) {
        elmCallerText.text('Show less')
        elmChild.attr('class', 'fa fa-chevron-up font-size-12 pl-1')
        revealEllipsisText(unique)
    } else {
        elmCallerText.text('Show more')
        elmChild.attr('class', 'fa fa-chevron-down font-size-12 pl-1')
        makeEllipsisText(unique)
    }
}

function buttonScroll() {
    let obj = '{"button": [' +
        '{"buttonId": "home-btn", "targetId": "about-me", "scrollSpeed": "1000"},' +
        '{"buttonId": "about-me-btn", "targetId": "about-me", "scrollSpeed": "1000"},' +
        '{"buttonId": "repo-btn", "targetId": "repositories", "scrollSpeed": "1000"},' +
        '{"buttonId": "apps-btn", "targetId": "apps", "scrollSpeed": "1000"}' +
        ']}'
    const parsedObj = JSON.parse(obj)
    let activeObj = $('#home-btn')
    let clickCount = 0

    for (let i = 0; i < parsedObj.button.length; i++) {
        $(`#${parsedObj.button[i].buttonId}`).click(function () {
            clickCount++

            if (clickCount <= 1) {
                activeObj.attr('class', 'nav-item')
                activeObj = $(`#${parsedObj.button[i].buttonId}`)
                $(this).attr('class', 'nav-item active')
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(`#${parsedObj.button[i].targetId}`).offset().top - 100
                }, parseInt(parsedObj.button[i].scrollSpeed), 'swing')
                clickCount = 0
            }
        })
    }
}

function appendRepositories(jsonObj, begin, end) {
    const container = $('#repositories-list')

    for (let i = begin; i < end; i++) {
        let starsElm = ``
        for (let j = 0; j < 5; j++) {
            starsElm += `<i class="fa fa-star ${j < parseInt(jsonObj[i].stars) ? 'text-orange' : ''}"></i>`
        }
        let element = `<div class="row pl-2 mkv-pv-2">
                            <div class="col-md-1">
                                <i class="fa fa-code-fork"></i>
                            </div>
                            <div class="col-md-4">
                                <a href="${jsonObj[i].url}" target="_blank">${jsonObj[i].name}</a>
                            </div>
                            <div class="col-md-5">
                                ${jsonObj[i].caption}
                            </div>
                            <div class="col-md-2 font-size-12" id="repo-stars">
                            ${starsElm}
                            </div>
                        </div>`
        container.append(element)
    }
}

function appendApps(jsonObj, begin, end) {
    const container = $('#apps-list .row.mkv-gxv-2')

    for (let i = begin; i < end; i++) {
        let starsElm = ``
        for (let j = 0; j < 5; j++) {
            starsElm += `<i class="fa fa-star ${j < parseInt(jsonObj[i].stars) ? 'text-orange' : ''}"></i>`
        }
        let element = `<div class="col-md-6">
                        <div class="card mb-2">
                            <div class="card-body text-gray-dark">
                                <div class="row">
                                    <div class="col-md-5 pb-3" onclick="location.href='${jsonObj[i].url}'">
                                        <img class="img-fluid"
                                             src="${jsonObj[i].logo_url}"
                                             alt="">
                                    </div>
                                    <div class="col-md-7">
                                        <p class="font-size-20 font-weight-bold">
                                            <a href="${jsonObj[i].url}">${jsonObj[i].name}</a>
                                        </p>
                                        <p class="font-size-14 pt-0">${jsonObj[i].advantage}</p>
                                        <div class="font-size-12 pt-0">
                                            ${starsElm}
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <p class="card-text" id="app-description-${i}">
                                            ${jsonObj[i].description}</p>
                                        <a class="app-description-reveal" id="app-description-reveal-${i}" onclick="appDescEllipsis('#app-description-${i}', '#app-description-reveal-${i}')">
                                        <span>Show more</span>
                                        <i class="fa fa-chevron-down font-size-12 pl-1"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        container.append(element)
    }
}

$(document).ready(function () {
    // Document elements
    const revealPhoto = $('#my-photo')
    const repoShowAll = $('#repo-show-all')
    const appsShowAll = $('#apps-show-all')
    const navUpDown = $('#nav-up-down')

    // Variables
    const mdbJSONparsed = JSON.parse(mdbJSON)

    buttonScroll()

    // Photo Reveal button action
    revealPhoto.click(function () {
        const imgSrc = 'assets/images/user/me.jpg'
        $(this).hover($(this).css({'opacity': '100%'}))
        $(this).find('img')
            .attr('src', imgSrc)
            .css({'opacity': '1'})
        $(this).find('div').remove()
    })

    //Nav Up Down button action
    navUpDown.click(function () {
        if (navUpDown.find('i').attr('class') === 'fa fa-chevron-down') {  // If position in top
            $([document.documentElement, document.body])
                .animate({scrollTop: $(document).height()}, 2000, 'swing', function () {
                    navUpDown.find('i').attr('class', 'fa fa-chevron-up')
                })
        } else {  // Otherwise
            $([document.documentElement, document.body])
                .animate({scrollTop: 0}, 2000, 'swing', function () {
                    navUpDown.find('i').attr('class', 'fa fa-chevron-down')
                })
        }
    })

    appendRepositories(mdbJSONparsed.repositories, 0, 5)
    appendApps(mdbJSONparsed.apps, 0, 5)

    // Repo show all repo button action
    repoShowAll.one('click', function () {
            appendRepositories(mdbJSONparsed.repositories, 5, mdbJSONparsed.repositories.length)
            repoShowAll.parent().append(
                `<p class="font-italic">
                    <span class="font-weight-bold">+${+parseInt(mdbJSONparsed.repositories.length) - 5}, </span>
                    Showing all repositories
                </p>`
            )
            repoShowAll.remove()
        }
    )
    // Apps show all app button action
    appsShowAll.one('click', function () {
        appendApps(mdbJSONparsed.apps, 5, mdbJSONparsed.apps.length)
        appsShowAll.parent().append(
            `<p class="font-italic">
                    <span class="font-weight-bold">+${parseInt(mdbJSONparsed.apps.length) - 5}, </span>
                    Showing all apps
                </p>`
        )
        appsShowAll.remove()
    })

    // jQuery.getJSON("assets/json/mdb.json", function () {
    //     console.log("jQuery getJSON success")
    // }).done(function (json) {  // If getJSON success
    //     appendRepositories(json.repositories, 0, 5)
    //     appendApps(json.apps, 0, 5)
    //
    //     // Repo show all repo button action
    //     repoShowAll.one('click', function () {
    //             appendRepositories(json.repositories, 5, json.repositories.length)
    //             repoShowAll.parent().append(
    //                 `<p class="font-italic">
    //                 <span class="font-weight-bold">${parseInt(json.repositories.length) - 5} fetched, </span>
    //                 Showing all repositories
    //             </p>`
    //             )
    //             repoShowAll.remove()
    //         }
    //     )
    //     // Apps show all app button action
    //     appsShowAll.one('click', function () {
    //         appendApps(json.apps, 5, json.apps.length)
    //         appsShowAll.parent().append(
    //             `<p class="font-italic">
    //                 <span class="font-weight-bold">${parseInt(json.apps.length) - 5} fetched, </span>
    //                 Showing all apps
    //             </p>`
    //         )
    //         appsShowAll.remove()
    //     })
    // })

})
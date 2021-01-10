(function ($) {

    // main home page 
    const $membersCtn = $('#members');
    const $msgsCtn = $('#messages-ctn');
    const $signOutBtn = $('.sign-out-btn');

    // ***************************************************************************************************
    // Show connected members section "aside"  on click to the button "picto" members  - Mobile device 
    // ***************************************************************************************************
    $('.members-btn').click(function () {
        $(this).toggleClass('bkgd-img-members');
        $('aside').toggleClass('toggle-aside');
    });


    // ***************************************************************************
    // Send request to fetch logged users "/logged"
    // ***************************************************************************
    const requestGetUsers = (token) => {
        return new Promise((resolve, reject) => {
            $.ajax(`${BASE_URL}/user/logged/${token}?alt=jsonp`)
                .done((res) => {
                    let response = JSON.parse(res);
                    if (response.result.status === "done") {
                        resolve(response.result.user);
                    } else {
                        reject(response);
                    }
                })
                .fail((err) => {
                    console.error(err);
                });
        })
    }


    // ******************************************************************************************
    // Send request to fetch the posted messages "/talk/list/"
    // ******************************************************************************************
    const requestGetMsgs = (token, timeStamp) => {
        return new Promise((resolve, reject) => {
            $.ajax(`${BASE_URL}/talk/list/${token}/${timeStamp}?alt=jsonp`)
                .done((res) => {
                    let response = JSON.parse(res);
                    if (response.result.status === "done") {
                        localStorage.setItem('lastTimeStamp', response.result.last_timestamp);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .fail((err) => {
                    console.error(err);
                });
        })
    }


    // ********************************************************************************
    // Send 2 requests get :  users logged & messages list then display them on the page
    // ********************************************************************************
    async function fetchAndDisplayUsersAndMessages(token, timeStamp) {
        try {
            const [response1, response2] = await Promise.all([
                requestGetUsers(token), requestGetMsgs(token, timeStamp)
            ])

            let users = response1;
            let messages = response2.result.talk;
            // Save the user name in the localStorage 
            let currentUser = localStorage.getItem('kwickUserName');

            let htmlUsers = '';
            for (let i = 0; i < users.length; i++) {
                htmlUsers += `<li class=${users[i] == currentUser ? "current-member" : "member"}> 
                                    <div class="icon-member">${users[i].substring(0, 2)}</div>
                              ${users[i] == currentUser ? '<b>' + users[i] + '</b> (You)' : users[i]} </li>`
            }

            let htmlMsgs = '';
            for (let j = 0; j < messages.length; j++) {
                htmlMsgs +=
                    `<div class=${messages[j].user_name == currentUser ? "own-msg" : "message"}>
                        <div class="user">
                            <div class="user-name-message">
                                <div class="icon-member">${messages[j].user_name.substring(0, 2)}</div>
                                <p>${messages[j].user_name == currentUser ? '<b>' + messages[j].user_name + '</b> (You)' : '<b>' + messages[j].user_name + '</b>'}</p>
                            </div>
                            <div class="date-message"> <p >${formatedTime(messages[j].timestamp)}</p></div>
                        </div>
                        <p>${messages[j].content}</p>
                    </div>`
            }

            $membersCtn.html(htmlUsers);
            $msgsCtn.html(htmlMsgs);

            $("html, body").animate({
                scrollTop: $(document).height() - $(window).height()
            });

        } catch (err) {
            console.log(`There's an error : `, err);
        }
    }


    // ********************************************************************************************
    // Verify if there's a token in localStorage before to execute fetchAndDisplayUsersAndMessages 
    // & redirect to index "sign-up page" if ther's no token
    // ********************************************************************************************
    (() => {
        let storedKwickToken = localStorage.getItem('kwickToken');
        if (storedKwickToken == null) {
            new Popup(() => {
                window.location.href = "../index.html";
            }, "You must to register to acces the tchat room!", false)
        }
        if (storedKwickToken != null) {
            fetchAndDisplayUsersAndMessages(localStorage.getItem('kwickToken'), 0);
        }


    })();




    // ***************************************
    // Request to post a message "say"
    // ***************************************
    const requestSayMsg = (token, id, message) => {
        return new Promise((resolve, reject) => {
            $.ajax(`${BASE_URL}/say/${token}/${id}/${encodeURI(message)}?alt=jsonp`)
                .done((res) => {
                    let response = JSON.parse(res);
                    if (response.result.status === "done") {
                        console.log("Your message has been posted succefully !")
                        // the messages after the last time stamp 
                        resolve(requestGetMsgs(token, localStorage.getItem('lastTimeStamp')));
                    } else {
                        reject(response);
                    }
                })
                .fail((err) => {
                    console.error(err);
                });
        })
    }

    // ***************************************************************************************
    // Send a message & fetch posted messages after timestamp then display them on the page
    // ***************************************************************************************
    let sendMessage = function () {
        $('#form-msg').on('submit', (e) => {
            e.preventDefault();
            let message = $('#message-input').val().trim();
            let token = localStorage.getItem('kwickToken');
            let id = localStorage.getItem('kwickId');
            // Focus on input msg 
            if (message.length == 0) {
                $('#message-input').focus();
            }
            if (message.length > 0) {
                if (message.length > 144) {
                    new Popup(
                        function () {
                            $('#pop-up-ctn').remove();
                            $('#message-input').focus();
                        }, "Your message is too long !", false);
                } else {
                    // send the message 
                    requestSayMsg(token, id, message)
                        // The response is the messages after the last time stamp 
                        .then(response => {
                            let msgsAfterTimeStamp = response.result.talk;
                            // take the user name from localStorage 
                            let currentUser = localStorage.getItem('kwickUserName');

                            let htmlMsgsAfterTimeStamp = '';
                            for (let k = 0; k < msgsAfterTimeStamp.length; k++) {
                                htmlMsgsAfterTimeStamp +=
                                    `<div class=${msgsAfterTimeStamp[k].user_name == currentUser ? "own-msg" : "message"}>
                                <div class="user">
                                    <div class="user-name-message">
                                        <div class="icon-member">${msgsAfterTimeStamp[k].user_name.substring(0, 2)}</div>
                                        <p>${msgsAfterTimeStamp[k].user_name == currentUser ? '<b>' + msgsAfterTimeStamp[k].user_name + '</b>'+ ' (You)' :  '<b>' +  msgsAfterTimeStamp[k].user_name +'</b>'}</p>
                                    </div>
                                    <div class="date-message"> <p >${formatedTime(msgsAfterTimeStamp[k].timestamp)}</p></div>
                                </div>
                                <p>${msgsAfterTimeStamp[k].content}</p>
                                </div>`
                            }
                            // Append only the messages posted after time stamp 
                            $msgsCtn.append(htmlMsgsAfterTimeStamp);
                            // Scrool to the bottom 
                            $("html, body").animate({
                                scrollTop: $(document).height() - $(window).height()
                            });
                        })

                    $('#message-input').val('').focus();
                }
            }
        });
    };
    sendMessage();



    // *********************************************
    // logout on click to the picto btn logout
    // *********************************************
    $signOutBtn.on('click', function () {
        new Popup(
            logOut, "Are you shure you want to logout?", true);
    });



    // *********************************************
    // Refresh request to fetch messages & users
    // *********************************************

    $('#refresh-to-fetch').on('click', () => {
        fetchAndDisplayUsersAndMessages(localStorage.getItem('kwickToken'), 0)
    });



})(jQuery);
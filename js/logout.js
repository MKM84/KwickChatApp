// ***************************************
// Log out  
// ***************************************
const logOut = function () {
    let token = localStorage.getItem('kwickToken');
    let id = localStorage.getItem('kwickId');

    $.ajax(`${BASE_URL}/logout/${token}/${id}?alt=jsonp`)
        .done((res) => {
            let response = JSON.parse(res);
            if (response.result.status === "done") {
                localStorage.removeItem('kwickToken');
                localStorage.removeItem('kwickId');
                localStorage.removeItem('kwickUserName');
                localStorage.removeItem('lastTimeStamp');
                localStorage.removeItem('remainingTime');

                window.location.href = "../index.html"

            }
        })
        .fail((err) => {
            console.error(err);
        });
}

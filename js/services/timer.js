// ***************************************************************************
// Session timer / 20 minnutes
// ***************************************************************************

let interval;

// Convert from seconds to minutes:seconds 
const CONVERT_SEC_TO_MIN_SEC = seconds => {
    let min = Math.floor(seconds / 60);
    if (min < 10) {
        min = '0' + min;
    }
    let sec = seconds % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }
    return `${min}:${sec}`;
};

// This function will be excuted to increment the session time duration (20 minutes) and 
// will desconnect the user when the session is over
const intervalAction = () => {
    let remainingTime = window.localStorage.getItem('remainingTime');
    remainingTime--;
    $('#timer').text(CONVERT_SEC_TO_MIN_SEC(remainingTime));
    window.localStorage.setItem('remainingTime', remainingTime);
    if (remainingTime < 3) {
        $('#timer').text('Your session is over !');
        window.localStorage.setItem('sessionIsFinished', 'true');
    }
    if (remainingTime == 1) {
        clearInterval(interval);
        logOut();
    }
}

// If there's a connection (remainingTime in locale storage) will create the interval 
const sessionTimer = () => {
    let remainingTimeStored = localStorage.getItem('remainingTime');
    if (remainingTimeStored > 0) {
        interval = setInterval(intervalAction, 1000);
    } else {
        interval = null;
    }
}

sessionTimer();

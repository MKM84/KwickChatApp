    // ***************************************************************************
    // Format timestamp to 10:30:23 format
    // ***************************************************************************
    function formatedTime(timeStamp) {
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let date = new Date(timeStamp * 1000);
        let hours = "0" + date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        let formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    }


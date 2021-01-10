  // Sign up inputs 
  const $inputSignUpUserName = $('#signUp-input');
  const $inputSignUpPassA = $('#passwSignUp-inputA');
  const $inputSignUpPassB = $('#passwSignUp-inputB');
  const $formSignUp = $('#form-sign-up');

  // Login inputs 
  const $inputLogInUserName = $('#logIn-input');
  const $inputLogInPass = $('#passwLogIn-input');
  const $formLogin = $('#form-log-in');

    //  The session durationn in seconds
  //   In case the user refreshes the page several times, deducting one minute for the lost time : (-60)
  let sessionDurationInSecondes = 1200 - 60;


  // ***************************************
  // Sign up 
  // Check if passwords are matching on sign up
  // ***************************************

  let isPassMatched;

  function checkIfPasswordsAreMatcching() {
      if ($inputSignUpPassA.val().length > 0 || $inputSignUpPassB.val() > 0) {
          isPassMatched = $inputSignUpPassA.val() == $inputSignUpPassB.val() ? true : false;
          // If the tow passwords are matching 
          if (isPassMatched == true) {
              $('#warnning b').text('Password is matching!').css('color', 'var(--blue-1)');
              $('.input-pass-sign-up').css('border-color', 'var(--blue-1)');
          } else {
              $('#warnning b').text('Password does not match!').css('color', 'var(--red)');
              $('.input-pass-sign-up:focus').css('border-color', 'var(--red)');
          }
      }
      return isPassMatched;
  }

  $inputSignUpPassA.on('keyup', () => {
      if ($inputSignUpPassB.val().length > 0) checkIfPasswordsAreMatcching();
  });
  $inputSignUpPassB.on('keyup', checkIfPasswordsAreMatcching);



  // ***************************************************************************
  // Sign up or Login 
  // ***************************************************************************
  // Request sign up or login  - save token in localStorage
  const register = (form, userName, password) => {
      return new Promise((resolve, reject) => {
          $.ajax(`${BASE_URL}/${form == $formSignUp ? "signup" : "login"}/${userName.val()}/${password.val()}?alt=jsonp`)
              .done((res) => {
                  let response = JSON.parse(res);
                  if (response.result.status === "done") {
                      localStorage.setItem('kwickId', response.result.id);
                      localStorage.setItem('remainingTime', sessionDurationInSecondes);
                      localStorage.setItem('kwickUserName', userName.val());

                      resolve(localStorage.setItem('kwickToken', response.result.token));
                  } else {
                      // If the form is sign up 
                      if (form == $formSignUp) {
                          new Popup(
                              () => {
                                  $('#pop-up-ctn').remove();
                                  $inputSignUpUserName.focus();
                                  $inputSignUpPassB.css('border-color', 'var(--gray-1)');
                              }, "Please try again with another user name!", false);
                          // If the form is login 
                      } else {
                          new Popup(
                              () => {
                                  $('#pop-up-ctn').remove();
                                  $inputLogInUserName.focus();
                              }, "Please verify your user name or password!", false);
                      }

                      return;
                  };
              })
              .fail((err) => {
                  reject(console.error(err));
              });
      });
  }

  // On sign up or login => send request to register,  save token then go to the tchat room
  function onSignUpOrLogin(form, userName, password) {
      form.on('submit', (e) => {
          e.preventDefault();

          let connectedUser = localStorage.getItem('kwickUserName');
          // If form is sign up 
          if (form == $formSignUp) {
              if (isPassMatched != true) return;
          }
          if(connectedUser != null) {   
            new Popup ( () => { 
                if(form == $formSignUp) {
                    window.location.href = "pages/tchat.html";
                    } else {
                      window.location.href = "tchat.html";
                    }
            }, `You are allready connected as ${connectedUser}!! You must logout to be able to connect again.`, false)
            return;
        }
          
          register(form, userName, password)
              .then(() => {
                  if(form == $formSignUp) {
                  window.location.href = "pages/tchat.html";
                  } else {
                    window.location.href = "tchat.html";
                  }
              })
            
      });
  }

  // sign up 
  onSignUpOrLogin($formSignUp, $inputSignUpUserName, $inputSignUpPassA);
  // Login 
  onSignUpOrLogin($formLogin, $inputLogInUserName, $inputLogInPass);



  // ***************************************************************************
  // If the user was disconnected automaticaly after the end of the session, 
  // then create a popup to inform him 
  // ***************************************************************************
  (() => {
          let sessionInfo = localStorage.getItem('sessionIsFinished');
          if (sessionInfo == 'true') {
              new Popup(() => {
                  window.localStorage.removeItem('sessionIsFinished');
                  $('#pop-up-ctn').remove();
              }, "Your session has been expired, please login again!", false)
          }
  })();

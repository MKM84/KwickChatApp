// ***************************************************************************
// class Popup
// ***************************************************************************
/**  
* @constructor
* @this {Popup}
* @param {function} callbackA The function to be excuted on instaciation.
* @param {text} msgTxt The popup text.
* @param {HtmlElement} btnCancel another button to cancel the excution of the function .
*/

class Popup {
    constructor(callbackA, msgTxt, btnCancel) {
        this.msgTxt = msgTxt;
        if (btnCancel) {
            this.btnCancel = btnCancel
        }
        this.display(callbackA);
    }

    display(callbackA) {

        const $content = `<div id="pop-up-ctn">
                                <div class="pop-up">
                                    <div class="pop-up-txt"><p>${this.msgTxt}</p></div>
                                    <div class="pop-up-btn-ctn">
                                        <button id="btn-pop-1">Ok</button>
                                        ${this.btnCancel === true ? '<button id="btn-pop-2">Cancel</button>' : ""}
                                    </div>
                                </div>
                             </div>`;

        $('body').append($content);
        // Ok btn 
        $('#btn-pop-1').on('click', callbackA);
        // Cancel btn 
        $('#btn-pop-2').on('click', () => {
            $('#pop-up-ctn').remove();
        });
        // Focus on the ok btn 
        $('#btn-pop-1').focus();

    }
}
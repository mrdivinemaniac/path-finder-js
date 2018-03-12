/**
 * Created by Divinemaniac on 3/8/2016.
 */

var Interface = {
    toggleExtended : function() {
        document.getElementById('sidebar').classList.toggle('extended');
    },
    toggleNewDialog : function() {
        document.getElementById('create-new-dialog').classList.toggle('invisible');
    },
    showMessage : function(message) {
        document.getElementById('message-dialog').classList.remove('invisible');
        document.getElementById('message-dialog-text').innerHTML = message;
        setTimeout(function() {
            Interface.hideMessage();
        },5000);
    },
    hideMessage : function() {
        document.getElementById('message-dialog').classList.add('invisible');
    },
    toggleSettingsDialog : function() {
        document.getElementById('settings-dialog').classList.toggle('invisible');
    }
};

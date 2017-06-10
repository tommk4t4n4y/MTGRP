﻿var login_view = API.createCamera(new Vector3(682.7154, 1063.229, 353.9427), new Vector3(-3.673188, -10.46521, -18.79283));
API.pointCameraAtPosition(login_view, new Vector3(718.9848, 1194.599, 325.2131));

var login_browser = null;

API.onResourceStart.connect(function () {

    var res = API.getScreenResolution();
    login_browser = API.createCefBrowser(res.Width, res.Height);
    API.waitUntilCefBrowserInit(login_browser);
    API.setCefBrowserPosition(login_browser, 0, 0);
    API.loadPageCefBrowser(login_browser, "player_manager/login/Login.html");
    API.showCursor(true);
    API.setCanOpenChat(false);
    API.setCefDrawState(true);
   
});

API.onServerEventTrigger.connect(function (eventName, args) {

    switch (eventName) {
        case "onPlayerConnectedEx":
            API.setActiveCamera(login_view);

            API.sleep(500);
            login_browser.call("update_box_info", API.getPlayerName(API.getLocalPlayer()), args[0]);
            break;
        case "login_finished":
            API.setActiveCamera(null);
            API.setCanOpenChat(true);
            break;
        case "login_error":
            login_browser.call("login_error", args[0]);
            break;
        case "hide_login_browser":
            API.showCursor(false);
            API.destroyCefBrowser(login_browser);
            API.setCefDrawState(false);
            break;
        case "admin_pin_check":
            var adminPin = API.getUserInput("", 6);
            API.triggerServerEvent("admin_pin_check", adminPin);
            break;
        case "create_admin_pin":
            var adminPinCreate = API.getUserInput("", 6);
            API.triggerServerEvent("create_admin_pin", adminPinCreate);
            break;
    }
});

function attempt_login(password) {
    API.triggerServerEvent("attempt_login", password);
}


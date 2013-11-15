Notification = window.Notification;

var Shim = function (title, options) {
    return new Notification(title, options);
};

if (!Notification) {
    Shim.permission = "unsupported";
} else {
    Shim.permission = Notification.permission;

    //If that was undefined, try getting it in chrome
    if (!Shim.permission && window.webkitNotification) {
        var chromePermissions = window.webkitNotification.checkPermissions();

        var permissionMap = {
            0: "granted",
            1: "default",
            2: "denied"
        };

        Shim.permission = permissionMap[ chromePermissions ];
    }
}

//Still not set? Who knows, assume unasked;
if (!Shim.permission) Shim.permission = 'default';


Shim.requestPermission = function (callback) {
    if (!Shim.isSupported()) {
        callback("unsupported");
    }

    Notification.requestPermission(function (perm) {
        Shim.permission = perm;
        callback(perm);
    });
};

Shim.permissionRequested = function () {
    return !!Shim.permission;
};

Shim.permissionGranted = function () {
    return Shim.permission === 'granted';
};

Shim.permissionDenied = function () {
    return Shim.permission === 'denied';
};

Shim.isSupported = function () {
    return !!Notification;
};

module.exports = Shim;

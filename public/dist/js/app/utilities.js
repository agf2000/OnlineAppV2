var my = {}; //my namespace

// $.widget.bridge('uitooltip', $.ui.tooltip);

kendo.culture("pt-BR");
kendo.culture().calendar.firstDay = 1;

moment.locale("pt-br");

// my.converter = new Showdown.converter();

function doesDataSourceHaveChanges(ds) {
    var dirty = false;

    $.each(ds._data, function() {
        if (this.dirty === true) {
            dirty = true;
        }
    });

    if (ds._destroyed.length > 0) dirty = true;

    return dirty;
}

/* remove border around all input elements */
if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
    $(window).load(function() {
        $('input:-webkit-autofill').each(function() {
            var text = $(this).val();
            var id = $(this).attr('id');
            $(this).after(this.outerHTML).remove();
            $('input[id=' + id + ']').val(text);
        });
    });
}

$(document).bind("keypress", function(e) {
    if (e.keyCode === kendo.keys.ESC) {
        var visibleWindow = $(".k-window:visible > .k-window-content");
        if (visibleWindow.length)
            visibleWindow.data("kendoWindow").close();
    }
});

my.isNumberKey = function(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 43 || charCode > 57))
        return false;

    return true;
};

my.isValidEmailAddress = function(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

my.formatPhone = function(phonenum) {
    //return text.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{2})\)?[-. ]?)?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "(" + parts[1] + ") "; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    } else {
        //invalid phone number
        return phonenum;
    }
};

my.encodeSlash = function(str) {
    var urlEncodeForwardSlashedRegExp = new RegExp("/", "gi");
    str = str.replace(urlEncodeForwardSlashedRegExp, "%2F");
    return str;
};

/**
 * Format postal code
 */
my.formatPostalcode = function(pcode) {
    var regexObj = /^\d{5}$|^\d{5}\-\d{}$/;
    if (regexObj.test(kendo.parseInt(pcode))) {
        var parts = pcode.match(regexObj);
        var pc = parts[1] + " " + parts[3];
        return pc.toUpperCase();
    } else {
        return pcode;
    }
};

my.getQuerystring = function(key, default_) {
    if (default_ === null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs === null)
        return default_;
    else
        return qs[1];
};

my.getStringParameterByName = function(name) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return sURL.split(name + '/')[1];
    } else {
        return '';
    }
};

my.getParameterByName = function(name) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return parseInt(sURL.split(name + '/')[1]);
    } else {
        return 0;
    }
};

my.getTopParameterByName = function(name) {
    var sURL = window.top.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return parseInt(sURL.split(name + '/')[1]);
    } else {
        return 0;
    }
};

my.formatCurrency = function(value) {
    return "R$ " + value.toFixed(2);
};

my.formatPercent = function(value) {
    return value.toFixed(2) + ' %';
};

my.Left = function(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0, n) + ' ...';
};

my.Right = function(str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
};


my.pmt = function(rate, per, nper, pv, fv) {

    fv = parseFloat(fv);

    nper = parseFloat(nper);

    pv = parseFloat(pv);

    per = parseFloat(per);

    if ((per === 0) || (nper === 0)) {

        alert("Why do you want to test me with zeros?");

        return (0);

    }

    rate = eval((rate) / (per * 100));

    if (rate === 0) // Interest rate is 0

    {

        pmt_value = -(fv + pv) / nper;

    } else {

        x = Math.pow(1 + rate, nper);

        pmt_value = -((rate * (fv + x * pv)) / (-1 + x));

    }

    pmt_value = my.conv_number(pmt_value, 2);

    return (parseFloat(pmt_value));

};

my.conv_number = function(expr, decplaces) { // This function is from David Goodman's Javascript Bible.

    var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));

    while (str.length <= decplaces) {

        str = "0" + str;

    }

    var decpoint = str.length - decplaces;

    return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));

};

my.scorePassword = function(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 4.9 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    };

    var variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
};

my.checkPassStrength = function(pass) {
    var score = my.scorePassword(pass);
    if (score > 80)
        return "Exceletente!";
    if (score > 60)
        return "Compatível, e boa.";
    if (score >= 30)
        return "Compatível, porém fraca.";

    return "Senha Não Compatível.";
};

my.size_format = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[[i]];
};

my.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

// Feature detect + local reference
my.storage;
var fail,
    uid;
try {
    uid = new Date;
    (my.storage = window.localStorage).setItem(uid, uid);
    fail = my.storage.getItem(uid) != uid;
    my.storage.removeItem(uid);
    fail && (my.storage = false);
} catch (e) {};

// kendo dataSource sorting parameterMap command convertion
my.convertSortingParameters = function(original) {
    if (original) {
        var sortIndex;
        var converted = "";
        for (sortIndex = 0; sortIndex < original.length; sortIndex += 1) {
            if (sortIndex > 0) { converted += ", "; }
            converted += original[sortIndex].field + " " + original[sortIndex].dir;
        }
        return converted;
    }
};

my.stripEndQuotes = function(s) {
    var t = s.length;
    if (s.charAt(0) == '"') s = s.substring(1, t--);
    if (s.charAt(--t) == '"') s = s.substring(0, t);
    return s;
}

my.createObject = function(value) {
    var str = $('<div/>').html(value).text();
    var obj = str.substring(1, str.length - 2);;
    return $('<' + obj + '/>');
};

//create a in-memory div, set it's inner text(which jQuery automatically encodes)
//then grab the encoded contents back out.  The div never exists on the page.
my.htmlDecode = function(value) {
    return $('<div/>').html(value).text();
};

my.htmlEncode = function(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
};

// HtmlHelpers Module
// Call by using my.htmlHelpers.getQueryStringValue("myname");
my.htmlHelpers = function() {
    return {
        // Based on http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
        getQueryStringValue: function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    };
}();

// StringHelpers Module
// Call by using StringHelpers.padLeft("1", "000");
my.stringHelpers = function() {
    return {
        // Pad string using padMask.  string '1' with padMask '000' will produce '001'.
        padLeft: function(string, padMask) {
            string = '' + string;
            return (padMask.substr(0, (padMask.length - string.length)) + string);
        }
    };
}();

my.displayCountdown = function() {
    var displayCountdownIntervalId,
        count = 3,
        countdown = function() {
            var cd = new Date(count * 1000),
                minutes = cd.getUTCMinutes(),
                seconds = cd.getUTCSeconds(),
                minutesDisplay = minutes === 1 ? '1 minuto ' : minutes === 0 ? '' : minutes + ' minutos ',
                secondsDisplay = seconds === 1 ? '1 segundo' : seconds + ' segundos',
                cdDisplay = minutesDisplay + secondsDisplay;

            $('#redirect-countdown').html(cdDisplay);
            count--;
        };
    countdown();
    displayCountdownIntervalId = window.setInterval(countdown, 1000);
};

// SessionManager Module
my.sessionManager = function() {
    // NOTE:  I use @Session.Timeout here, which is Razor syntax, and I am pulling that value
    //        right from the ASP.NET MVC Session variable.  Dangerous!  Reckless!  Awesome-sauce!
    //        You can just hard-code your timeout here if you feel like it.  But I might cry.
    var sessionTimeoutSeconds = my.htmlHelpers.getQueryStringValue('smt') || (20 * 60),
        countdownSeconds = my.htmlHelpers.getQueryStringValue('smc') || 300,
        secondsBeforePrompt = sessionTimeoutSeconds - countdownSeconds,
        $dlg,
        displayCountdownIntervalId,
        promptToExtendSessionTimeoutId,
        originalTitle = document.title,
        count = countdownSeconds,
        extendSessionUrl = '/desktopmodules/rildoinfo/api/store/ExtendTime',
        expireSessionUrl = '/desktopmodules/rildoinfo/api/store/ExpireTime';

    var endSession = function() {
        $dlg.dialog('close');
        // location.href = expireSessionUrl;
        $.get(expireSessionUrl, { portalId: _portalID, userName: _userName }, function(data) {});
        setTimeout(function() {
            location.href = _returnURL;
        }, 500);
    };

    var displayCountdown = function() {
        var countdown = function() {
            var cd = new Date(count * 1000),
                minutes = cd.getUTCMinutes(),
                seconds = cd.getUTCSeconds(),
                minutesDisplay = minutes === 1 ? '1 minuto ' : minutes === 0 ? '' : minutes + ' minutos ',
                secondsDisplay = seconds === 1 ? '1 segundo' : seconds + ' segundos',
                cdDisplay = minutesDisplay + secondsDisplay;

            document.title = 'Expira em ' +
                my.stringHelpers.padLeft(minutes, '00') + ':' +
                my.stringHelpers.padLeft(seconds, '00');
            $('#sm-countdown').html(cdDisplay);
            if (count === 0) {
                document.title = 'Esta Sessão se Expirou.';
                endSession();
            }
            count--;
        };
        countdown();
        displayCountdownIntervalId = window.setInterval(countdown, 1000);
    };

    var promptToExtendSession = function() {
        $dlg = $('#sm-countdown-dialog')
            .dialog({
                title: 'Aviso de Final de Sessão',
                height: 250,
                width: 330,
                bgiframe: true,
                modal: true,
                buttons: {
                    'Continuar': function() {
                        $(this).dialog('close');
                        refreshSession();
                        document.title = originalTitle;
                    },
                    'Sair': function() {
                        endSession(false);
                    }
                }
            });
        count = countdownSeconds;
        displayCountdown();
    };

    var refreshSession = function() {
        window.clearInterval(displayCountdownIntervalId);
        var img = new Image(1, 1);
        img.src = extendSessionUrl;
        window.clearTimeout(promptToExtendSessionTimeoutId);
        startSessionManager();
    };

    var startSessionManager = function() {
        promptToExtendSessionTimeoutId =
            window.setTimeout(promptToExtendSession, secondsBeforePrompt * 1000);
    };

    // Public Functions
    return {
        start: function() {
            startSessionManager();
        },

        extend: function() {
            refreshSession();
        }
    };
}();

my.padLeft = function(str, max) {
    str = str.toString();

    function main(str, max) {
        return str.length < max ? main("0" + str, max) : str;
    }
    return main(str, max);
};

String.prototype.padLeft = function padLeft(length, leadingChar) {
    if (leadingChar === undefined) leadingChar = "0";
    return this.length < length ? (leadingChar + this).padLeft(length, leadingChar) : this;
};

Date.prototype.addSeconds = function(seconds) {
    this.setDate(this.getSeconds() + seconds);
    return this;
};

Date.prototype.addMinutes = function(minutes) {
    this.setDate(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addMonths = function(months) {
    this.setDate(this.getMonth() + months);
    return this;
};

Date.prototype.addYears = function(years) {
    this.setDate(this.getFullYear() + years);
    return this;
};

my.daysBetween = function(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY);
};

my.setHours = function(date, days, nhr, nmin, nsec) {
    var d, s;
    d = date;
    d = date.addDays(days);
    d.setHours(nhr, nmin, nsec);
    s = "Current setting is " + d.toLocaleString();
    return (d);
};

String.prototype.strip = function() {
    var translate_re = /[úõôóíêéçãâáàÚÕÔÓÍÊÉÇÃÁÀÂ]/g;
    var translate = {
        "À": "A",
        "Á": "A",
        "Ã": "A",
        "Â": "A",
        "Ç": "C",
        "É": "E",
        "Ê": "E",
        "Í": "I",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ú": "U",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ç": "c",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ú": "u"
    };
    return (this.replace(translate_re, function(match) {
        return translate[match];
    }));
};

// file encoding must be UTF-8!
my.getTextExtractor = function() {
    return (function() {
        var patternLetters = /[úõôóíêéçãâáàÚÕÔÓÍÊÉÇÃÁÀÂ]/g;
        var patternDateDmy = /^(?:\D+)?(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/;
        var lookupLetters = {
            "À": "A",
            "Á": "A",
            "Ã": "A",
            "Â": "A",
            "Ç": "C",
            "É": "E",
            "Ê": "E",
            "Í": "I",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ú": "U",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ç": "c",
            "é": "e",
            "ê": "e",
            "í": "i",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ú": "u"
        };
        var letterTranslator = function(match) {
            return lookupLetters[match] || match;
        }

        return function(node) {
            var text = $.trim($(node).text());
            var date = text.match(patternDateDmy);
            if (date)
                return [date[3], date[2], date[1]].join("-");
            else
                return text.replace(patternLetters, letterTranslator);
        }
    })();
};

my.generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

jQuery.fn.getCheckboxVal = function() {
    var vals = [];
    this.each(function() {
        vals.push(kendo.parseInt(jQuery(this).val()));
    });
    return vals;
};

my.stack_bottomright = { "dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25 };
my.stack_bottomleft = { "dir1": "up", "dir2": "right", "firstpos1": 25, "firstpos2": 25 };
my.stack_topleft = { "dir1": "down", "dir2": "right", "push": "top" };
my.stack_topright = { "dir1": "down", "dir2": "left", "firstpos1": 25, "firstpos2": 25 };

var ValidationUtility = function() {
    var validationElements = $('[data-role="validate"]');
    var elementCount;

    validationElements.popover({
        placement: 'top',
        trigger: 'manual'
    });

    validationElements.on('invalid', function() {
        if (elementCount === 0) {
            $('#' + this.id).addClass('invalid');
            $('#' + this.id).popover('show');
            elementCount++;
        }
    });

    validationElements.on('blur', function() {
        $('#' + this.id).removeClass('invalid');
        $('#' + this.id).popover('hide');
    });

    var validate = function(formSelector) {
        elementCount = 0;

        if (formSelector.indexOf('#') === -1) {
            formSelector = '#' + formSelector;
        }

        return $(formSelector)[0].checkValidity();
    };

    return {
        validate: validate
    };
};

my.minmax = function(value, min, max) {
    if (parseInt(value) < 0 || isNaN(value))
        return 0;
    else if (parseInt(value) > 100)
        return 100;
    else return value;
};

window.downloadFile = function(sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}

my.zeroPad = function(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

my.getSettingValue = function(name) {
    return my.userInfo.storeSettings.filter(function(a) { return a.settingname === name })[0].settingvalue.toLowerCase()
};

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
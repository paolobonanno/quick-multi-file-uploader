(function ($) {

    var internalPrefix = "_quickMultiFileUploader";

    var ajaxOptionKeys = Object.keys($.ajaxSetup());

    var ajaxOptions = {
        method: "post",
        cache: false,
        processData: false,
        contentType: false,
        complete: function () { },
        error: function () { },
        success: function () { },
        beforeSend: function () { }
    };

    function showLog(condition, message, logFn) {
        if (condition) {
            logFn("quickMultiFileUploader: " + message);
        }

        return condition;
    }
    
    function showError(condition, message) {
        return showLog(condition, message, console.error);
    }

    function showWarn(condition, message) {
        return showLog(condition, message, console.warn);
    }

    function checkOptionsType(options) {
        if (options === undefined) {
            options = {};
        }

        if (options && typeof options === "object") {
            options = $.extend({}, options);
        }

        return options;
    }

    function checkOptionsData(data) {
        for (var key in data) {
            if (data[key] === "") {
                data[key] = true;
            } else if (data[key] === "false") {
                data[key] = false;
            } else if (data[key] === "true") {
                data[key] = true;
            }
        }
    }

    function quickMultiFileUploader(elem, options) {

        var data = $.extend({}, $.quickMultiFileUploader.defaults);
        var ajaxData = {};

        function addOptions(options) {
            for (var dataAttributeKey in options) {
                var objectToFill = $.inArray(dataAttributeKey, ajaxOptionKeys) !== -1 ? ajaxData : data;
                objectToFill[dataAttributeKey] = options[dataAttributeKey];
            }
        }

        function setOptions(options) {
            options = checkOptionsType(options);
            
            addOptions(elem.dataset);
            addOptions(options);//eventually overwrite dataset

            $.extend(ajaxData, ajaxOptions);//eventually overwrite with ajaxOptions
            
            checkOptionsData(data);
            checkOptionsData(ajaxData);

            $(elem).off("change", startUpload);

            if (data.uploadOnChange) {
                $(elem).on("change", startUpload);
            }
        }

        function startUpload() {

            if (!showWarn(elem.files.length <= 0, "there are no files loaded")) {

                if (!showError(!($.inArray("url", ajaxData) === -1), "the url must be defined")) {

                    if (!showError(data.useInputName && $(elem).attr("name") === undefined, "the name attribute must be defined")) {
                        
                        var elemName = $(elem).attr("name");
                        var formData = new FormData();
                        
                        for (var i = 0; i < elem.files.length; i++) {
                            if (data.useInputName) {
                                formData.append(elemName, elem.files[i], elem.files[i].name);
                            } else {
                                formData.append(elem.files[i].name, elem.files[i], elem.files[i].name);
                            }
                        }

                        //exclude callback
                        for (var dataKey in data) {
                            if (typeof data[dataKey] !== "function") {
                                formData.append(dataKey, data[dataKey]);
                            }
                        }

                        if (data.beforeSend(elem, $.map(elem.files, function (el) { return el.name; }), elem.files)) {
                            var beforeSendCallback = { beforeSend: function (jqXHR, settings) { data.beforeSend(elem, jqXHR, settings); } };

                            $.ajax($.extend({ data: formData }, ajaxData, beforeSendCallback))
                                .done(function (dataAjax, textStatus, jqXHR) {
                                    data.onSuccess(elem, dataAjax, textStatus, jqXHR);
                                })
                                .fail(function (jqXHR, textStatus, errorThrown) {
                                    data.onError(elem, jqXHR, textStatus, errorThrown);
                                })
                                .always(function (dataAjax, textStatus, jqXHR) {
                                    if (data.resetAfterUpload) {
                                        elem.value = "";
                                    }
                                    data.onComplete(elem, dataAjax, textStatus, jqXHR);
                                });
                        }
                    }
                }
            }
        }

        if (!showError(!$(elem).is("input") || $(elem).attr("type") !== "file", "this plugin must be used for file input elements")) {

            setOptions(options);

            $(elem).data(internalPrefix, this);

            this.setOptions = setOptions;
            this.upload = startUpload;
            this.d = function () { return data; };
        }
    }

    if (!showError(!("FormData" in window), "FormData is not supported in you browser")) {

        $.fn.extend({
            quickMultiFileUploader: function (options) {

                var result = this.map(function () {
                    return $.quickMultiFileUploader(this, options);
                });

                return result.length > 1 ? result : result[0];
            }
        });

        $.quickMultiFileUploader = function (elem, options) {
            var previousInstance = $(elem).data(internalPrefix);

            if (previousInstance !== undefined) {
                previousInstance.setOptions(options);
                return previousInstance;
            } else {
                return new quickMultiFileUploader(elem, options);
            }
        };

        $.quickMultiFileUploader.defaults = {
            uploadOnChange: true,
            resetAfterUpload: true,
            useInputName: false,

            //callbacks
            beforeSend: function (elem, filenames, files) { return true; }, //if return false, ajax call doesn't start

            //Ajax callbacks
            onError: function (elem, jqXHR, textStatus, errorThrown) { },
            onSuccess: function (elem, data, textStatus, jqXHR) { },
            onComplete: function (elem, data, textStatus, jqXHR) { }
        };

        $(document).ready(function () {
            $(".quickMultiFileUploader").quickMultiFileUploader();
        });
    }

}(jQuery));

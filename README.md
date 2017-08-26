
# Quick multi file uploader
A jQuery plugin to send multiple files through Ajax.

## Setup
Include jQuery 1.6+ and the plugin in your project:
```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.quickMultiFileUploader.min.js"></script>
```
### Initialize
#### Option 1
Set the *quickMultiFileUploader* class and *data-url* attribute:
```html
<input name="files" class="quickMultiFileUploader" type="file" multiple data-url="/server/UploadFile" />
```
#### Option 2
Initialize through javascript:
```html
<input name="files" id="files" type="file" multiple />
```
```html
<script type="text/javascript">
    $(document).ready(function () {
            $('#files').quickMultiFileUploader({
                url: "/server/UploadFile"
            });
        });
</script>
```
### Start upload
#### On file select
This plugin can send files when users select them.

You have to set the *on-change-upload* data-attribute in html:
```html
<input name="files" class="quickMultiFileUploader" type="file" multiple data-url="/server/UploadFile" data-on-change-upload />
```
or set the *onChangeUpload* option in javascript initialize:
```html
<input name="files" id="files" type="file" multiple />
```
```html
<script type="text/javascript">
    $(document).ready(function () {
            $('#files').quickMultiFileUploader({
                url: "/server/UploadFile",
                onChangeUpload: true
            });
        });
</script>
```
#### Periodically
You can start upload by calling plugin as in this example:
```javascript
function startUploadFiles(){
  $('#files').quickMultiFileUploader().upload();
}
```

## Options
* Url: String

  A string containing the URL to which the files are sent.
* Upload on change: Boolean (default: true)

  The upload start after file selection.
* Reset after upload: Boolean (default: true)

  Input file is reset after upload, even if server response an error.

#### Examples
These options are settable as data-attributes or through javascript.
```html
<input data-upload-on-change reset-after-upload data-url="/server/UploadFile" name="files" class="quickMultiFileUploader" type="file" multiple />
```
```html
<input data-upload-on-change="false" data-url="/server/UploadFile" name="files" class="quickMultiFileUploader" type="file" multiple />
```

```html
<script type="text/javascript">
    $(document).ready(function () {
            $('#files').quickMultiFileUploader({
                url: "/server/UploadFile",
                uploadOnChange: false,
                resetAfterUpload: false,
            });
        });
</script>
```

### Callbacks
* Before send (input html element, array: filenames, FileList: files) => boolean

  Is invoked before ajax call starts. Ajax call starts inly if return is true.
* On success (input html element, data, textStatus, jqXHR)

  Is invoked if the request to server succeeds. It receives the returned data, a string containing the success code, and the jqXHR object.
* On error (input html element, jqXHR, textStatus, errorThrown)

  Is invoked if the request to server fails. It receives the jqXHR, a string indicating the error type, and an exception object if applicable.
* On success (input html element, data, textStatus, jqXHR)

  Is invoked when the request finishes, whether in failure or success. It receives the jqXHR object, as well as a string containing the success or error code.
#### Examples
These callbacks are settable through javascript.

```html
<script type="text/javascript">
    $(document).ready(function () {
            $('#files').quickMultiFileUploader({
                    beforeSend: function (elem, jqXHR, settings) {
                        //todo
                        return true/false;
                    },
                    onError: function (elem, jqXHR, textStatus, errorThrown) {
                        //todo
                    },
                    onSuccess: function (elem, data, textStatus, jqXHR) {
                        //todo
                    },
                    onComplete: function (elem, data, textStatus, jqXHR) {
                        //todo
                    },
            });
        });
</script>
```
### Ajax setup
Also ajax options are settable as data-attributes or through javascript.

You can set:
* accepts
* async
* contents
* converters
* flatOptions
* global
* isLocal
* jsonp

### Change setting after inizialization

```html
<script type="text/javascript">
    function myFunction() {
        $('#files').quickMultiFileUploader({
            url: "/server2/UploadFile",
            uploadOnChange: false
        });
    }
</script>
```

```html
<script type="text/javascript">
    function myFunction() {
        $('#files').quickMultiFileUploader().setOptions({
            url: "/server2/UploadFile",
            uploadOnChange: false
        });
    }
</script>
```
## Full examples
### Client side
* Auto upload files to server.
  ```html
  <input name="files" class="quickMultiFileUploader" type="file" multiple data-url="/server/UploadFile" />
  ```
* Auto upload files to server and use callbacks.
  ```html
  <input name="files" id="files" type="file" multiple />
  ```
  ```html
  <script type="text/javascript">
      $(document).ready(function () {
              $('#files').quickMultiFileUploader({
                  url: "/server/UploadFile",
                  beforeSend: function(){
                      //showLoading();
                  },
                  onComplete: function(){
                      //hideLoading();
                  }
              });
          });
  </script>
  ```
* Upload files to server only when funnyName function is invoked.
  ```html
  <input name="files" id="files" class="quickMultiFileUploader" type="file" multiple data-url="/server/UploadFile" data-upload-on-change="false" />
  ```
  ```html
  <script type="text/javascript">
      function funnyName() {
          $('#files').quickMultiFileUploader().upload();
      }
  </script>
  ```
### Server side
#### Asp.NET MVC
/Controllers/HomeController.cs:
```csharp
[HttpPost]
public ActionResult UploadFile()
{
	foreach (string fileName in Request.Files)
	{
		HttpPostedFileBase file = Request.Files[fileName];
		//ToDo
	}

	return //
}
```

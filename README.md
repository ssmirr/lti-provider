# lti-provider

Activity: Add a h1 header showing "Hello Docable!" on top of the paragraph:

```|{type: 'playground', grade_this: true, grade_this_check: "$('div.my-5').text().includes('DOCABLE')" }
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>

<div class="w-50 mx-auto my-5">

    <p style="background-color:Tomato;" id="paragraph">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
    Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
    </p>

</div>

</body>
</html>
```

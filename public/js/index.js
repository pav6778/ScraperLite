
$.getJSON('/articles', function(data){
    for(let i = 0; i < data.length; i++){

        $('#scrapedData')
        .append('<h4 data-id=' + data[i]._id + '>' + data[i].title + '</h4>' + '<a href='+ data[i].link + '>' +"View Source"+ '</a>'+'<div id="commentsDiv" class="text-right"><a href="/articles/'+ data[i].note +'">Comments</a> </div>' +'<br><br>');
}
})

$(document).on('click', 'h4', function(){

$('#noteBox').empty();

let currentArticleId = $(this).attr('data-id');

$.ajax({method:'GET', url:'/articles/'+ currentArticleId})
.then(function(data){

    console.log(data.title)
    $('#noteBox').append('<h3>' + data.title + '</h3>');
    $('#noteBox').append('<input class="form-control bg-dark text-white" id="titleId" name="title" >')
    $('#noteBox').append('<textarea rows="10" class="form-control bg-dark text-white" id="textId" name="body"></textarea>')
    $("#noteBox").append('<input class="form-control bg-dark text-warning" type="submit" value="Save Note" data-id="' + data._id + '" id="savenote">');

    if (data.note) {
        $("#titleId").val(data.note.title);
        $("#textId").val(data.note.body);
      }

    })
});


$(document).on('click', '#savenote', function(){

    let currentArticleId = $(this).attr('data-id');

    $.ajax({method:'POST', url:'/articles/'+ currentArticleId, data: {
        title: $('#titleId').val(),
        body: $('#textId').val()
         }
    })
    .then(function(data){

        $('#noteBox').empty();
    });
    $('#titleId').val("")
    $('#textId').val("")
})

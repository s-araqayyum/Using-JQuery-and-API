$(document).ready(function(){

    //GET
    $.ajax({
        url: 'https://6423832777e7062b3e333909.mockapi.io/api/products',
        method: 'GET',
        dataType: 'json',
        success: function(articlesOfClothing) {
            articlesOfClothing.forEach(function(article) {
            $('tbody').append('<tr><td>' + article.id + '</td><td>' + article.title + '</td><td>' 
                + article.category + '</td><td><button id="edit" onclick="">Update</button></td><td><button id="del">Delete</button></td></tr>');
          });
        },
        error: function(error) {
            errorText = jQuery.parseJSON(error.responseText);
            console.log("Detecting an error! Error is as follows: " + error.responseText);
        }
    });

    $('#headerOfTable th').click(function() {
        
        var firstComparison, secondComparison = 0
        var columnToSort = $(this).index();
        var tr = $('#bodyOfTable tr').toArray();

        tr.sort(function(first, second) {
            firstComparison = $(first).find('td').eq(columnToSort).text();
            secondComparison = $(second).find('td').eq(columnToSort).text();
            
            if (columnToSort == 0) { //First column is numeric - sorted based on numbers
                return parseInt(secondComparison) - parseInt(firstComparison)
            } else { //All other columns presented by API are String values
                return secondComparison.localeCompare(firstComparison);
            }
        });

        $('#bodyOfTable').empty().append(tr);
    });

    $('#addData').click(function() {
        $('.form-group').slideToggle();
    });

    // Validation and Ajax POST
    $('.form-group').submit(function(e) {
        e.preventDefault();
        var buttonPressed = $(document.activeElement).attr('id');
        console.log(buttonPressed)
        if(buttonPressed === "submitData"){
            var title = $('#title-input').val();
            var category = $('select').val();

            if (title == '') {
            alert('Please enter an article name');
            return;
            }
        
            if (category == null) {
            alert('Please select a category');
            return;
            }
        
            $.ajax({
                url: 'https://6423832777e7062b3e333909.mockapi.io/api/products',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    title: title,
                    category: category
                }),
                success: function(data) {
                    $('#title-input').val('');
                    $('#category-select').val(null);
                    var indexNumber = parseInt($("#table tr:last td:first").text())+1
                    $('tbody').append('<tr><td>' + indexNumber + '</td><td>' + data.title + '</td><td>' 
                        + data.category + '</td><td><button id="edit">Update</button></td><td><button id = "del" >Delete</button></td></tr>'); 
                        $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
                },
                error: function(error) {
                    errorText = jQuery.parseJSON(error.responseText);
                    console.log("Detecting an error! Error is as follows: " + error.responseText);
                }
            });
            $(".form-group").slideUp();
        }
    });

    //DELETE
    $(document).on('click', '#del', function() {
        var productInQuestion = $(this).closest('tr');
        var rowIndex = productInQuestion.find('td:first-child').text();
        console.log(rowIndex)

        $.ajax({
            url: 'https://6423832777e7062b3e333909.mockapi.io/api/products/' + rowIndex,
            method: 'DELETE',
            success: function() {
                console.log("Deleting Product #"+rowIndex);
                $(productInQuestion).fadeOut('slow', function() {
                    $(this).remove();
                  });
            },
            error: function(error) {
                errorText = jQuery.parseJSON(error.responseText);
                console.log("Detecting an error! Error is as follows: " + error.responseText);
            }
        });
    })

    //PUT
    $(document).on('click', '#edit', function() {
        var productInQuestion = $(this).closest('tr');
        var rowIndex = productInQuestion.find('td:first-child').text();
        var form = $('.form-group')
        console.log(rowIndex)
    
        $(form).slideDown();
    
        addButton = form.find('#submitData')
        updateButton = form.find('#updateData')
        $(addButton).hide()
        $('#updateData').show()

        $('html, body').animate({scrollTop: 0}, 'slow');
    
        var title = productInQuestion.find('td:nth-child(2)').text();
        var category = productInQuestion.find('td:nth-child(3)').text();
        console.log(title, category)
        $('#title-input').val(title);
        $('select').val(category);
    
        $(updateButton).click(function(){
            $.ajax({
                url: 'https://6423832777e7062b3e333909.mockapi.io/api/products/' + rowIndex,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    title: $('#title-input').val(),
                    category: $('select').val()
                }),
                success: function() {
                    console.log("Editing Product #"+rowIndex);
                    productInQuestion.find('td:nth-child(2)').text($('#title-input').val());
                    productInQuestion.find('td:nth-child(3)').text($('select').val());

                    addButton = form.find('#submitData')
                    updateButton = form.find('#updateData')
                    $(addButton).show()
                    $('#updateData').hide()
                    $(form).slideUp();

                    $('#title-input').val('');
                    $('#category-select').val(null);
                },
                error: function(error) {
                    errorText = jQuery.parseJSON(error.responseText);
                    console.log("Detecting an error! Error is as follows: " + error.responseText);
                }
            });
        });
    });
})
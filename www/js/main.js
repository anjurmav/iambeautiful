$(document).ready(function(){

    window.addEventListener('load', init);
    
    $(document).on('click', '#add-button', function(){
        $('#add-modal').modal({ 
            show: true
        });
    });

    $("form[name='add_info']").submit(function(e){
        //Check if Input is Empty
        if(!$.trim($('#add_text').val())) {
             return false;
        }

        $("#save-item").button('loading');
        e.preventDefault();

        //Count Current Total Reminders
        var totalreminders = window.localStorage.getItem('reminderno');
        var remindercounter = "";
        //If NULL set first number
        if(totalreminders == null || totalreminders == ""){
            window.localStorage.setItem('reminderno', 1);
        }
        else{
            remindercounter = parseInt(totalreminders) + 1;
            window.localStorage.setItem('reminderno', remindercounter);
        }

        //Save New Reminder in the Database
        
        //Get Info
        var nowtotalreminders = window.localStorage.getItem('reminderno'); //ID
        var content = $('#add_text').val(); //Content 
        var reminderstat = "new";
        
        //Put Data as Object
        var datax = {"reminderlog": nowtotalreminders, "content": content, "status": reminderstat };

        var myarray = [];
        if(window.localStorage.getItem('reminders') != null){ //If Reminder Storage is null
            var myarray = JSON.parse(window.localStorage.getItem('reminders')); //Get Stored Reminders
            myarray.push(datax); //Insert New Reminder
        }
        else{
            myarray.push(datax); //Insert New Reminder
        }
        
        //Save New Set of Reminder in Localstorage
        window.localStorage.setItem('reminders', JSON.stringify(myarray));

        var result = window.localStorage.getItem('reminders');
        //console.log(result);

        setTimeout (function () {
            $('#add_text').val('');
            $("#save-item").button('reset');

            //Refresh Display
            $('#reminder-result').html('');
            reminderss = JSON.parse(window.localStorage.getItem('reminders'));
            reminderss = reminderss.sort(function (a, b) {
               return a.status < b.status?1:-1;
            });

            $.each(reminderss, function(key, value){

                //Content Display
                if(value.content.length > 28) 
                    contentdisplay = value.content.substring(0,28)+" ...";
                else
                    contentdisplay = value.content;

                //If Done change background
                if(value.status == "new"){
                    $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
                }
                else{
                    $('#reminder-result').append('<tr style=" text-decoration: line-through; background-color: #ccc; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');   
                }
           });
        }, 1000);
    });
    

    //ONCLICK ITEM
    $(document).on('click', '.remind', function(){
        $('#open-modal').modal('show');
        //Get ID
        var getid = $(this).attr('dx-id');
        var reminderx = [];
        reminderx = JSON.parse(window.localStorage.getItem('reminders'));
        //Get Content From Storage
        $.each(reminderx, function(key, value){
            if(value.reminderlog == getid){
                $('#reminder-content').html(value.content);
                $('#delete-button').attr('dx-id', value.reminderlog);
                //Display Button for Status
                //If New
                if(value.status == "new"){
                    $('#stats-button').html('<a id="done-button" class="btn btn-success" href="#" role="button" dx-id="'+value.reminderlog+'"><i class="fa fa-check-square fa-1x"></i></a>');
                }
                else{
                     $('#stats-button').html('<a id="undo-button" class="btn btn-warning" href="#" role="button" dx-id="'+value.reminderlog+'"><i class="fa fa-minus-square fa-1x"></i></a>');
                }

            }
        }); 
    });
    
    //CLICK DONE
    $(document).on('click', '#done-button', function(){
        var getid = $(this).attr('dx-id');

        $.each(reminderss, function(key, value){
            if(value.reminderlog == getid){
                $.extend(reminderss[key], {"status" : "done"});
                //console.log(reminderss[key].status);
                window.localStorage.setItem('reminders', JSON.stringify(reminderss));

                //Refresh Display
                $('#reminder-result').html('');
                
                reminderss = JSON.parse(window.localStorage.getItem('reminders'));
                reminderss = reminderss.sort(function (a, b) {
                   return a.status < b.status?1:-1;
                });

                $.each(reminderss, function(key, value){

                    //Content Display
                    if(value.content.length > 28) 
                        contentdisplay = value.content.substring(0,28)+" ...";
                    else
                        contentdisplay = value.content;

                    //If Done change background
                    if(value.status == "new"){
                        $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
                    }
                    else{
                        $('#reminder-result').append('<tr style=" text-decoration: line-through; background-color: #ccc; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');   
                    }
                });
                
                setTimeout(function(){
                    $('#open-modal').modal('hide');
                }, 1000);
                
            }
        });
    });

    //CLICK UNDO
    $(document).on('click', '#undo-button', function(){
        var getid = $(this).attr('dx-id');

        $.each(reminderss, function(key, value){
            if(value.reminderlog == getid){
                $.extend(reminderss[key], {"status" : "new"});
                //console.log(reminderss[key].status);
                window.localStorage.setItem('reminders', JSON.stringify(reminderss));

                //Refresh Display
                $('#reminder-result').html('');
                
                reminderss = JSON.parse(window.localStorage.getItem('reminders'));
                reminderss = reminderss.sort(function (a, b) {
                   return a.status < b.status?1:-1;
                });

                $.each(reminderss, function(key, value){

                    //Content Display
                    if(value.content.length > 28) 
                        contentdisplay = value.content.substring(0,28)+" ...";
                    else
                        contentdisplay = value.content;

                    //If Done change background
                    if(value.status == "new"){
                        $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
                    }
                    else{
                        $('#reminder-result').append('<tr style=" text-decoration: line-through; background-color: #ccc; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');   
                    }
                });

                setTimeout(function(){
                    $('#open-modal').modal('hide');
                }, 1000);
            }
        });
    });

    //CLICK DELETE
    $(document).on('click', '#delete-button', function(){
        var getid = $(this).attr('dx-id');

        someArray = reminderss;
        idRemoved = someArray.filter(function(el) {
            return el.reminderlog !== getid;
        });

        window.localStorage.setItem('reminders', JSON.stringify(idRemoved));

                //Refresh Display
                $('#reminder-result').html('');
                
                reminderss = JSON.parse(window.localStorage.getItem('reminders'));
                reminderss = reminderss.sort(function (a, b) {
                   return a.status < b.status?1:-1;
                });

                $.each(reminderss, function(key, value){

                    //Content Display
                    if(value.content.length > 28) 
                        contentdisplay = value.content.substring(0,28)+" ...";
                    else
                        contentdisplay = value.content;

                    //If Done change background
                    if(value.status == "new"){
                        $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
                    }
                    else{
                        $('#reminder-result').append('<tr style=" text-decoration: line-through; background-color: #ccc; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');   
                    }
                });
                
                setTimeout(function(){
                    $('#open-modal').modal('hide');
                }, 1000);
         
    });

    //On Pull Down for Refresh
    /*$("#pullarea").pullToRefresh().on("end.pulltorefresh", function (e, percent){
        console.log('refresh');
        $('#reminder-result').html('');
        //Sorting
        var reminderss = [];
        reminderss = JSON.parse(window.localStorage.getItem('reminders'));
        reminderss = reminderss.sort(function (a, b) {
            return a.status < b.status;
        });
        //Display Each
        $.each(reminderss, function(key, value){
          $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-id="'+value.reminderlog+'"><td>'+value.content+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
        });
    });*/


    //INITIAL LOAD
    $('#reminder-result').html('');

    //Sorting
    var reminderss = [];
    reminderss = JSON.parse(window.localStorage.getItem('reminders'));
    reminderss = reminderss.sort(function (a, b) {
        return a.status < b.status?1:-1;
    });
    //console.log(reminderss);
    //Display each
    $.each(reminderss, function(key, value){
        //Content Display
        if(value.content.length > 28) 
            contentdisplay = value.content.substring(0,28)+" ...";
        else
            contentdisplay = value.content;
        
        //Set Status Background
        if(value.status == "new"){
            $('#reminder-result').append('<tr style="background-color: #ffffff; color: #000000;" dx-stat="'+value.status+'" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');
        }
        else{
            $('#reminder-result').append('<tr style=" text-decoration: line-through; background-color: #ccc; color: #000000;" dx-id="'+value.reminderlog+'" class="remind"><td>'+contentdisplay+'<i class="fa fa-chevron-right fa-1x pull-right"></i></td></tr>');   
        }         
   });
    //window.localStorage.clear();
});


function SplashBeGone() {
    $('#splash').css('display', 'none');
    $('#loadingpage').css('display', 'block');
}
function init() {
    
    document.getElementById('splash').style.display = 'block';
    setTimeout(function(){
        SplashBeGone();
    }, 3000);
}
